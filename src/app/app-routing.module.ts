import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderRegisterComponent } from './order-register/order-register.component';

const routes: Routes = [
  { path: 'register', component: OrderRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
