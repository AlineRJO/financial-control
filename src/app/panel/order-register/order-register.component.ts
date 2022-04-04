import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TypeOperationEnum } from '../../models/type-operation-enum';
import { FirebaseDatabaseResource } from '../../firebase-database/firebase-database.resource';

@Component({
  selector: 'app-order-register',
  templateUrl: './order-register.component.html',
  styleUrls: ['./order-register.component.scss']
})
export class OrderRegisterComponent implements OnInit {

  endDate: string = <any>new Date();
  //startDate: string = <any>new Date();
  typeOperationEnum = TypeOperationEnum;
  ordemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseDbRsc: FirebaseDatabaseResource
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
      quantity: 0
    });
  }

  orderSave() {
    const dateForm = new Date(this.ordemForm.get('dateOperation').value).toLocaleDateString('pt-BR', { timeZone: 'UTC'});
    this.ordemForm.get('dateOperation').setValue(dateForm, { emitEvent: false });
    this.firebaseDbRsc.insert('order', this.ordemForm.value);    
  }
}
