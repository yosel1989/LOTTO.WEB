import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerRoutingModule,

    CustomerComponent
  ],
  providers: [DatePipe]
})
export class CustomerModule { }
