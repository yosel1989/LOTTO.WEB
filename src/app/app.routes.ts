import { Routes } from '@angular/router';




import { AuthComponent } from './features/auth/pages/auth/auth.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthRedirectGuard } from './core/guards/auth-redirect.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin' },


  // auth
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AuthRedirectGuard],
  },

  // admin
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/layout/layout.module').then(m => m.LayoutModule),
    canActivate: [AuthGuard],
  },

/*
  {
    path: 'demo1',
    component: Demo1Component,
    children: [
      { path: '', component: Demo1IndexComponent },
    ],
  },
  {
    path: 'demo2',
    component: Demo2Component,
    children: [
      { path: '', component: Demo2IndexComponent },
    ],
  },
  {
    path: 'demo3',
    component: Demo3Component,
    children: [
      { path: '', component: Demo3IndexComponent },
    ],
  },
  {
    path: 'demo4',
    component: Demo4Component,
    children: [
      { path: '', component: Demo4IndexComponent },
    ],
  },
  {
    path: 'demo5',
    component: Demo5Component,
    children: [
      { path: '', component: Demo5IndexComponent },
    ],
  },
  {
    path: 'demo6',
    component: Demo6Component,
    children: [
      { path: '', component: Demo6IndexComponent },
    ],
  },
  {
    path: 'demo7',
    component: Demo7Component,
    children: [
      { path: '', component: Demo7IndexComponent },
    ],
  },
  {
    path: 'demo8',
    component: Demo8Component,
    children: [
      { path: '', component: Demo8IndexComponent },
    ],
  },
  {
    path: 'demo9',
    component: Demo9Component,
    children: [
      { path: '', component: Demo9IndexComponent },
    ],
  },
  {
    path: 'demo10',
    component: Demo10Component,
    children: [
      { path: '', component: Demo10IndexComponent },
    ],
  },*/
];
