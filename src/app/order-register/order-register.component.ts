import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-register',
  templateUrl: './order-register.component.html',
  styleUrls: ['./order-register.component.scss']
})
export class OrderRegisterComponent implements OnInit {

  endDate: string = <any>new Date();
  startDate: string = <any>new Date();

  constructor() { }

  ngOnInit(): void {
  }

}
