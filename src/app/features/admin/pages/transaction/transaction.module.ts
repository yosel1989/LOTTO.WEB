import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TransactionRoutingModule,

    TransactionComponent
  ],
  providers: [DatePipe]
})
export class TransactionModule { }
