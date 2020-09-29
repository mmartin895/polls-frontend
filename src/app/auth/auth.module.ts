import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import {NbAuthModule} from '@nebular/auth';
import {NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule} from '@nebular/theme';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {AuthGuard} from './auth.guard';
import {PermissionGuard} from './permission-guard';
import {NbEvaIconsModule} from '@nebular/eva-icons';


@NgModule({
  declarations: [AuthComponent, LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbCardModule,
    NbEvaIconsModule,
    NbIconModule,
    AuthRoutingModule,

    NbAuthModule
  ],
  providers: [
    AuthGuard,
    PermissionGuard
  ]
})
export class AuthModule { }
