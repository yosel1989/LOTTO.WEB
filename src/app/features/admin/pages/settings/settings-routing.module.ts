import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [{
  path: '',
  component: SettingsComponent,
  children: [
    {
      path: 'variables',
      loadComponent: () => import('./settings-variables/settings-variables.component').then(m => m.SettingsVariablesComponent)
    },
    {
      path: 'permissions',
      loadComponent: () => import('./settings-permissions/settings-permissions.component').then(m => m.SettingsPermissionsComponent)
    },
    {
      path: 'profiles',
      loadComponent: () => import('./settings-profiles/settings-profiles.component').then(m => m.SettingsProfilesComponent)
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
