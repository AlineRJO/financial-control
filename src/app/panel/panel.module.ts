import {NgModule} from '@angular/core';
import { PoButtonModule, PoContainerModule, PoFieldModule, PoProgressModule, PoTableModule, PoTabsModule, PoModule } from '@po-ui/ng-components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PanelRoutingModule} from './panel-routing.module';
import {CommonModule} from '@angular/common';
import { OrderRegisterComponent } from './order-register/order-register.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { StatisticComponent } from './statistic/statistic.component';


@NgModule({
  imports: [
    FormsModule,
    PoButtonModule,
    CommonModule,
    PoContainerModule,
    PoTabsModule,
    ReactiveFormsModule,
    PoTableModule,
    PoProgressModule,
    PoFieldModule,
    PoModule,
    PanelRoutingModule,
  ],
  declarations: [
    OrderRegisterComponent,
    LoginComponent,
    MenuComponent,
    StatisticComponent
  ]
})
export class PanelModule {}
