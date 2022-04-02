import { Component, OnInit } from '@angular/core';
import { PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { FirebaseDatabaseResource } from '../../firebase-database/firebase-database.resource';
import { IssueModel } from '../../models/issue-model';
import { StatisticService } from '../../service/statistic.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  columns: PoTableColumn[];
  itemsOriginal: IssueModel[];
  items: IssueModel[];
  pmValue: number = 0;
  optionsOrder: PoSelectOption[] = [];

  constructor(
    private firebaseDatabaseRsc: FirebaseDatabaseResource,
    private statisticSvc: StatisticService
    ) { }

  ngOnInit(): void {
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
    return this.items.map(i => {
      return {
        label: this.statisticSvc.substringOrder(i),
        value: this.statisticSvc.substringOrder(i)
      }
    });
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
    } else {
      this.items = this.itemsOriginal;
      this.pmValue = 0;
    }
  }
}
