import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserDashboardComponent } from './user-dashboard.component';
import { UserDashboardRoutes } from './user-dashboard.routing';
import { MaterialModule } from '../shared/material-module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(UserDashboardRoutes)
  ],
  declarations: [UserDashboardComponent]
})
export class UserDashboardModule { }
