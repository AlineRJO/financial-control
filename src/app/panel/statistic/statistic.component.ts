import { Component, OnInit } from '@angular/core';
import { PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { FirebaseDatabaseResource } from '../../firebase-database/firebase-database.resource';
import { IssueModel } from '../../models/issue-model';
import { StatisticService } from '../../service/statistic.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TypeOperationEnum } from '../../models/type-operation-enum';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  columns: PoTableColumn[];
  itemsOriginal: IssueModel[];
  items: IssueModel[];
  tokenBuyList: Array<string> = [];
  pmValue: number = 0;
  optionsFilterOrder: PoSelectOption[] = [];
  optionsToOrder: PoSelectOption[] = [];
  form: FormGroup;
  typeOperationEnum = TypeOperationEnum;

  constructor(
    private firebaseDatabaseRsc: FirebaseDatabaseResource,
    private statisticSvc: StatisticService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.getColumns();
    if (!this.items || this.items.length === 0) {
      this.getData();
    }
  }

  getData() {    
    this.firebaseDatabaseRsc.get('order').subscribe(result => {
      this.items = result;
      this.itemsOriginal = this.listSort('orderPar');
      this.optionsFilterOrder = this.getOptionsCrypto();
      this.getOptionsToOrder();
    });
  }

  getColumns() {
    this.columns = [
      { property: 'orderPar'},
      { property: 'dateOperation' },
      { property: 'amount' },
      { property: 'quantity' },
      { property: 'typeOperation', type: 'cellTemplate' },
      { property: 'quotation' },
    ];
  }

  listSort(order: string) {
    return this.items.sort((a,b) => {
      if(a[order] > b[order] ) {return 1;}
      if(a[order] < b[order] ) {return -1;}
      return 0;
    });
  }

  getOptionsCrypto() {
    return this.items.map(i => {
      return {
        label: this.statisticSvc.substringOrder(i),
        value: this.statisticSvc.substringOrder(i)
      }
    });
  }

  getOptionsToOrder() {
    this.optionsToOrder = this.columns.map(i => {
      return {
        label: i.property.toString(),
        value: i.property.toString()
      }
    });
  }

  getBuyedList() {
    this.tokenBuyList = [];
    this.items.forEach(i => {
      const buyed = this.statisticSvc.lastSubstringOrder(i);
      if (buyed != 'BRL') {
        this.tokenBuyList.push(buyed);
      }

      this.tokenBuyList = this.tokenBuyList.map(item => item)
        .filter((value, index, self) => self.indexOf(value) === index);
    });
    this.createGroup();
  }

  filterOrderList(search: string) {
    if (search) {      
      this.items = this.itemsOriginal.filter(orders => {
      const token = this.statisticSvc.substringOrder(orders);
      if (token === search) {
        return orders;
      }
    });
    this.pmValue = this.statisticSvc.calcPM(this.items);
    this.getBuyedList();    
    } else {
      this.items = this.itemsOriginal;
      this.pmValue = 0;
    }
  }
  
  createGroup() {
    const group = this.fb.group({});
    this.tokenBuyList.forEach(control => group.addControl(control, this.fb.control('')));
    this.form = group;

    if (this.form && this.tokenBuyList) {
      this.items.forEach(i => {
        const buyedToken = this.statisticSvc.lastSubstringOrder(i);
        if (buyedToken !== 'BRL') {
          const quotationValue =  !i.quotation || i.quotation === 0 ? 1 : i.quotation;
          this.form.get(buyedToken).setValue(quotationValue);
        }
      });
    }
  }

  insertQuotation() {
    const objectList = Object.getOwnPropertyNames(this.form.value);
    let newItemsToken;

    if (objectList.length) {
       objectList.map(token => {
        newItemsToken = this.statisticSvc
        .preparedQuotationList(this.items, {token: token, value: this.form.get(token).value});
      });
    } else {
      this.items.map(token => {
        token.quotation = token?.quotation > 0 ? token.quotation : 1;
        this.firebaseDatabaseRsc.update('order', token); 
      });
    }
   

    this.items = newItemsToken ? newItemsToken : this.items;
    this.pmValue = this.statisticSvc.calcPM(this.items);       
  }

}
