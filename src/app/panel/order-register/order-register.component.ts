import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TypeOperationEnum } from '../../models/type-operation-enum';
import { FirebaseDatabaseResource } from '../../firebase-database/firebase-database.resource';
import { StatisticService } from '../../service/statistic.service';

@Component({
  selector: 'app-order-register',
  templateUrl: './order-register.component.html',
  styleUrls: ['./order-register.component.scss']
})
export class OrderRegisterComponent implements OnInit {

  endDate: string = <any>new Date();
  typeOperationEnum = TypeOperationEnum;
  ordemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseDbRsc: FirebaseDatabaseResource,
    private statisticSvc: StatisticService
    ) { }

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.ordemForm = this.fb.group({
      dateOperation: new Date(),
      typeOperation: this.typeOperationEnum.buy,
      amount: 0,
      orderPar: '',
      quantity: 0,
      quotation: 1
    });
  }

  orderSave() {
    const dataForm = this.ordemForm.value;

    dataForm.dateOperation = new Date(this.ordemForm.get('dateOperation').value).toLocaleDateString('pt-BR', { timeZone: 'UTC'});
    dataForm.quotation = this.statisticSvc.preparedNumber(this.ordemForm.get('quotation').value);    
    dataForm.quantity = this.statisticSvc.preparedNumber(this.ordemForm.get('quantity').value);    
    dataForm.amount = this.statisticSvc.preparedNumber(this.ordemForm.get('amount').value);
    
    this.firebaseDbRsc.insert('order', dataForm);    
  }
}
