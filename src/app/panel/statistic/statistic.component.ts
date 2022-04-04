import { Component, OnInit } from '@angular/core';
import { PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { FirebaseDatabaseResource } from '../../firebase-database/firebase-database.resource';
import { IssueModel } from '../../models/issue-model';
import { StatisticService } from '../../service/statistic.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  optionsOrder: PoSelectOption[] = [];
  form: FormGroup;

  constructor(
    private firebaseDatabaseRsc: FirebaseDatabaseResource,
    private statisticSvc: StatisticService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.fb.group({});
    this.getColumns();
    this.getData();
  }

  getData() {
    this.firebaseDatabaseRsc.get('order').subscribe(result => {
      this.itemsOriginal = this.listSort(result);
      this.items = this.itemsOriginal;
      this.optionsOrder = this.getOptionsCrypto();
    });
  }

  getColumns() {
    this.columns = [
      { property: 'orderPar'},
      { property: 'dateOperation' },
      { property: 'amount' },
      { property: 'quantity' },
      { property: 'typeOperation' },
    ];
  }

  listSort(list) {
    return list.sort((a,b) => {
      if(a.orderPar > b.orderPar) {return 1;}
      if(a.orderPar < b.orderPar) {return -1;}
      return 0;
    });
  }

  getOptionsCrypto() {
    const newItems =  this.items.map(i => {
      return {
        label: this.statisticSvc.substringOrder(i),
        value: this.statisticSvc.substringOrder(i)
      }
    });
    
    return newItems;
  }

  getBuyedList() {
    this.tokenBuyList = [];
    this.items.map(i => {
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
    return group;
  }
}
