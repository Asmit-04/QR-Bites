import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import {RouteGuardService} from './services/route-guard.service';
import { ManageOrderComponent } from './material-component/manage-order/manage-order.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'cafe',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/cafe/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule),
          // canActivate:[RouteGuardService],
          data:{
            expectedRole:['admin','user']
          }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate:[RouteGuardService],
        data:{
          // expectedRole:['admin', 'user']
          expectedRole:['admin']
        }
      },

      {
        path: 'userdashboard',
        loadChildren: () => import('./user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule ),
        // canActivate: [RouteGuardService],
        data: {
          expectedRole: ['user']
        }
      },
      {
        path: 'order',  // Add route for handling orders
        component: ManageOrderComponent  // Specify the component to handle orders
      },
    ]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }





























// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './home/home.component';
// import { FullComponent } from './layouts/full/full.component';
// import { RouteGuardService } from './services/route-guard.service';

// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   {
//     path: 'cafe',
//     component: FullComponent,
//     canActivate: [RouteGuardService],
//     data: { expectedRole: ['admin', 'user'] },
//     children: [
//       { path: '', redirectTo: '/cafe/get-product', pathMatch: 'full' },
//       {
//         path: '',
//         loadChildren: () => import('./material-component/material.module').then(m => m.MaterialComponentsModule),
//         canActivate: [RouteGuardService],
//         data: { expectedRole: ['admin', 'user'] }
//       },
//       {
//         path: 'dashboard',
//         loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
//         canActivate: [RouteGuardService],
//         data: { expectedRole: ['admin'] }
//       },
//       {
//         path: 'userdashboard',
//         loadChildren: () => import('./user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule),
//         canActivate: [RouteGuardService],
//         data: { expectedRole: ['user'] }
//       },
//     ]
//   },
//   { path: '**', component: HomeComponent }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
