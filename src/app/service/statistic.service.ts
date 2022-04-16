import { Injectable } from '@angular/core';
import { IssueModel } from '../models/issue-model';
import { FirebaseDatabaseResource } from '../firebase-database/firebase-database.resource';
import { TypeOperationEnum } from '../models/type-operation-enum';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private firebaseDatabaseRsc: FirebaseDatabaseResource) {}

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
}
