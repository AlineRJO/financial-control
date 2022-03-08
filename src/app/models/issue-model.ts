import { TypeOperationEnum } from './type-operation-enum';

export interface IssueModel {
  par: string;
  date: Date;
  amout: number;
  typeOperation: TypeOperationEnum;
}
