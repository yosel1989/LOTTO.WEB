import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivoComponent } from './archivo.component';

const routes: Routes = [{
  path: '',
  component: ArchivoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivoRoutingModule { }
