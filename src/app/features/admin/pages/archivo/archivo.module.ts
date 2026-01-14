import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ArchivoComponent } from './archivo.component';
import { ArchivoRoutingModule } from './archivo-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ArchivoRoutingModule,

    ArchivoComponent
  ],
  providers: [DatePipe]
})
export class ArchivoModule { }
