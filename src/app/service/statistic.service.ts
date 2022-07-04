import { Injectable } from '@angular/core';
import { IssueModel } from '../models/issue-model';
import { FirebaseDatabaseResource } from '../firebase-database/firebase-database.resource';
import { TypeOperationEnum } from '../models/type-operation-enum';
import { CryptoCurrencyService } from './crypto-currency.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(
    private firebaseDatabaseRsc: FirebaseDatabaseResource,
    private cryptoCurrencyService: CryptoCurrencyService
    ) {}

  substringOrder(item: IssueModel) {
    const index = item.orderPar.indexOf('-');
    return item.orderPar.substring(0, index);
  }

  lastSubstringOrder(item: IssueModel) {
    const index = item.orderPar.indexOf('-');
    return item.orderPar.substring(index +1);
  }

  calcPM(listFiltred: IssueModel[]): number {
    // TODO: O CALC DEVERÁ SER FEITO CONVERTENDO PARA A MOEDA BRL
    
    const {numeradorTotal, denominadorTotal} = listFiltred.reduce((acc, result) => {
      if (result.typeOperation === TypeOperationEnum.buy) {
        const denominadorTotal = +result.quantity;
        const quotation = this.preparedNumber(result?.quotation);
        const numeradorTotal = +result.quantity * (+result.amount) * (quotation === 0 ? 1 : quotation);

        acc.denominadorTotal = acc.denominadorTotal + denominadorTotal;
        acc.numeradorTotal = acc.numeradorTotal + numeradorTotal;

      }
      return acc;
    }, {numeradorTotal:0, denominadorTotal: 0});

    return numeradorTotal/denominadorTotal;
  }

  preparedNumber(value: number): number {
    if (value) {
      return +(value.toString().replace(',', '.'));    
    }
  }

  preparedQuotationList(listFiltred: IssueModel[], data: {token: string, value: number}) {
    return listFiltred.map(item => {
      const valuePrepared = this.preparedNumber(data.value);;
      const buyedToken = this.lastSubstringOrder(item);
      if(buyedToken === data.token  && (!item.quotation || item.quotation === 0)) {
        item.quotation = valuePrepared ? valuePrepared : 1;
      } else if (buyedToken === 'BRL') {
        item.quotation = 1;
      }
      
      this.firebaseDatabaseRsc.update('order', item); 
      return item;
    });
  }

  listSort(order: string, items: Array<any>) {
    return items.sort((a,b) => {
      if(a[order] > b[order] ) {return 1;}
      if(a[order] < b[order] ) {return -1;}
      return 0;
    });
  }

  itemsRegroup(items: IssueModel[]): Array<any> {
    let regrouped;
    let parAux = '';
    let obj;
    
    const itemsOrdered = this.listSort('orderPar', items);
    
    itemsOrdered.forEach((item) => {
      const parName = this.substringOrder(item);
      if (parAux == '') {
        parAux = parName;
        const data = {
          [parName]: [item]
        };
        
        obj = data;
      } else if ( parAux !== parName ) {
        parAux = parName;
        const data = {
          [parName]: [item]
        };
        
        obj = Object.assign(regrouped, data);
      } else {
        regrouped[parName].push(item);
      }
      regrouped = obj;
    });

    return regrouped;
  }

  mapStatisticData(items: IssueModel[]) {
    const reagupData = this.itemsRegroup(items);
    const orderList = Object.getOwnPropertyNames(reagupData);
    
    const prepareData = [];

    for(let i = 0; orderList.length > i; i++) {
      prepareData.push({
        par: orderList[i],
        PM: +this.calcPM(reagupData[orderList[i]]).toFixed(2),
        currencyValue: this.cryptoCurrencyService.getTokenPrice(reagupData[orderList[i]])
      })
    }
    console.log(`prepareData`, prepareData);
    
    return prepareData;
  }

  getCurrencyCryptoValues(orderList: string[]) {
    return
  }
}
