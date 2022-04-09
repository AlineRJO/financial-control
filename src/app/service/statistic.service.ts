import { Injectable } from '@angular/core';
import { IssueModel } from '../models/issue-model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

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
  
      const denominadorTotal = +result.quantity;
      const numeradorTotal = +result.quantity * (+result.amount) * (+result?.quotation | 1);

      acc.denominadorTotal = acc.denominadorTotal + denominadorTotal;
      acc.numeradorTotal = acc.numeradorTotal + numeradorTotal;

      console.log(`acc`, acc);
      console.log(`quotation`, (+result?.quotation | 1));
      return acc;
    }, {numeradorTotal:0, denominadorTotal: 0});
    console.log('numeradorTotal', numeradorTotal);
    console.log('denominadorTotal', denominadorTotal);
    return numeradorTotal/denominadorTotal;
  }

  preparedNumber(value: number): number {
    return +(value.toString().replace('.', ',').replace(',', ''));
  }

  preparedQuotationList(listFiltred: IssueModel[], data: {token: string, value: number}) {
    return listFiltred.map(item => {
      const buyedToken = this.lastSubstringOrder(item);
      if(buyedToken === data.token && (!item.quotation || item.quotation === 0)) {
        item.quotation = data.value;
      } else if (buyedToken === 'BRL') {
        item.quotation = 1;
      }
      
      return item;
    });
  }
}
