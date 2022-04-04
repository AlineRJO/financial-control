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
  
      acc.denominadorTotal = this.preparedNumber(result.quantity);
      acc.numeradorTotal = this.preparedNumber(result.quantity) * this.preparedNumber(result.amount);

      return acc;
    }, {numeradorTotal:0, denominadorTotal: 0});
    return numeradorTotal/denominadorTotal;
  }

  preparedNumber(value: number): number {
    const teste = +(value.toString().replace('.', '').replace(',', '.'));
    return teste;
  }
}
