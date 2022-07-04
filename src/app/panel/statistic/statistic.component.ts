import { Component, OnInit } from '@angular/core';
import { PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { FirebaseDatabaseResource } from '../../firebase-database/firebase-database.resource';
import { IssueModel } from '../../models/issue-model';
import { StatisticService } from '../../service/statistic.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TypeOperationEnum } from '../../models/type-operation-enum';
import { CryptoCurrencyService } from '../../service/crypto-currency.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  columns: PoTableColumn[];
  cryptoColumns: PoTableColumn[];
  itemsOriginal: IssueModel[];
  items: IssueModel[];
  regrouped: Array<any>;
  tokenBuyList: Array<string> = [];
  pmValue: number = 0;
  optionsFilterOrder: PoSelectOption[] = [];
  optionsToOrder: PoSelectOption[] = [];
  form: FormGroup;
  typeOperationEnum = TypeOperationEnum;

  constructor(
    private firebaseDatabaseRsc: FirebaseDatabaseResource,
    public statisticSvc: StatisticService,
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
      this.itemsOriginal = this.statisticSvc.listSort('orderPar', this.items);
      this.getOptionsCrypto();
      this.getOptionsToOrder();
      this.itemsRegroup(result);
    });
  }

  getColumns() {
    this.columns = [
      { property: 'orderPar'},
      { property: 'dateOperation' },
      { property: 'amount' },
      { property: 'quantity' },
      { property: 'typeOperation', type: 'cellTemplate' },
      { property: 'quotation' }
    ];

    this.cryptoColumns = [
      { property: 'par', label: 'Token'},
      { property: 'currencyValue', label: 'Valor Atual', type: 'cellTemplate'},
      { property: 'PM', label: 'PM(R$)', type: 'cellTemplate' },
    ];
  }

  getOptionsCrypto(): void {
    const optionsList = this.items.map(i => {
      return {
        label: this.statisticSvc.substringOrder(i),
        value: this.statisticSvc.substringOrder(i)
      }
    });
    optionsList.splice(0, 0, {
      label: 'Todos',
      value: ''
    })
    this.optionsFilterOrder = optionsList;
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
    if (search && search != '0') {      
      this.items = this.itemsOriginal.filter(orders => {
      const token = this.statisticSvc.substringOrder(orders);
      if (token === search) {
        return orders;
      }
    });
    this.pmValue = +this.statisticSvc.calcPM(this.items).toFixed(2);
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

  itemsRegroup(items: IssueModel[]) {
    this.regrouped = this.statisticSvc.mapStatisticData(items);
    console.log('regrouped', this.regrouped);
  }
}
