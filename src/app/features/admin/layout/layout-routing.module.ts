import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'sorteos',
        loadChildren: () => import('../pages/sorteo/sorteo.module').then(m => m.SorteoModule)
      },
      {
        path: 'archivos',
        loadChildren: () => import('../pages/archivo/archivo.module').then(m => m.ArchivoModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('../pages/customer/customer.module').then(m => m.CustomerModule)
      },
      {
        path: 'customers/:uuid',
        loadComponent: () => import('../pages/customer/customer-info/customer-info.component').then(m => m.CustomerInfoComponent),
        children:[
          {
            path: 'general',
            loadComponent: () => import('../pages/customer/customer-general/customer-general.component').then(m => m.CustomerGeneralComponent)
          }, {
            path: 'financial-bets',
            loadComponent: () => import('../pages/customer/customer-finantial-bets/customer-finantial-bets.component').then(m => m.CustomerFinantialBetsComponent)
          }, {
            path: 'reports',
            loadComponent: () => import('../pages/customer/customer-reports/customer-reports.component').then(m => m.CustomerReportsComponent)
          }, {
            path: 'configuration',
            loadComponent: () => import('../pages/customer/customer-configuration/customer-configuration.component').then(m => m.CustomerConfigurationComponent)
          }, {
            path: '',
            redirectTo: 'general',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'report/transactions',
        loadChildren: () => import('../pages/transaction/transaction.module').then(m => m.TransactionModule)
      },
      {
        path: 'report/orders',
        loadChildren: () => import('../pages/orders/orders.module').then(m => m.OrdersModule)
      },  
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsModule)
      }, 
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
