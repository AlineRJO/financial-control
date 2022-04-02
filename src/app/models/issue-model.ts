import { TypeOperationEnum } from './type-operation-enum';

export interface IssueModel {
  orderPar: string;
  dateOperation: Date;
  amount: number;
  quantity: number;
  typeOperation: TypeOperationEnum;
}
