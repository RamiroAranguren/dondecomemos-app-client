import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePasswordPageRoutingModule } from './change-password-routing.module';

import { ChangePasswordPage } from './change-password.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    ChangePasswordPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {}
