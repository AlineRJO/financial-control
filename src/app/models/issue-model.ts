import { TypeOperationEnum } from './type-operation-enum';

export interface IssueModel {
  orderPar: string;
  dateOperation: Date;
  amout: number;
  typeOperation: TypeOperationEnum;
}
