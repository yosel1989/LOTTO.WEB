import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    SettingsRoutingModule,
    SettingsComponent,
    RouterModule
  ],
  providers: [DatePipe]
})
export class SettingsModule { }
