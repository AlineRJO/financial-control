import {NgModule} from '@angular/core';
import {PoButtonModule, PoContainerModule, PoFieldModule, PoProgressModule, PoTableModule, PoTabsModule} from '@po-ui/ng-components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PanelRoutingModule} from './panel-routing.module';
import {CommonModule} from '@angular/common';
import { OrderRegisterComponent } from './order-register/order-register.component';
import { LoginComponent } from './login/login.component';


@NgModule({
    imports: [
        PoFieldModule,
        FormsModule,
        PoButtonModule,
        PanelRoutingModule,
        CommonModule,
        PoContainerModule,
        PoTabsModule,
        ReactiveFormsModule,
        PoTableModule,
        PoProgressModule
    ],
  declarations: [
    OrderRegisterComponent,
    LoginComponent
  ]
})
export class PanelModule {}
