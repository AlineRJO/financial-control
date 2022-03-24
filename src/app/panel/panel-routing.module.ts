import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { OrderRegisterComponent } from './order-register/order-register.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  { path: 'sign-in', component: LoginComponent },
  { path: 'register', component: OrderRegisterComponent },
  { path: 'menu', component: MenuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule {}
