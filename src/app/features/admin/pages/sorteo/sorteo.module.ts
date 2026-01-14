import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SorteoRoutingModule } from './sorteo-routing.module';
import { SorteoComponent } from './sorteo.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SorteoRoutingModule,

    SorteoComponent
  ],
  providers: [DatePipe]
})
export class SorteoModule { }
