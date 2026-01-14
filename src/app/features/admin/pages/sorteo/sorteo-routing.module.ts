import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SorteoComponent } from './sorteo.component';

const routes: Routes = [{
  path: '',
  component: SorteoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SorteoRoutingModule { }
