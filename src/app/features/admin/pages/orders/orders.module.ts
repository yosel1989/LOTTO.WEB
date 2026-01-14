import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrdersRoutingModule,

    OrdersComponent
  ],
  providers: []
})
export class OrdersModule { }
