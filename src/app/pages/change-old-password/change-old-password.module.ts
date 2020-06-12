import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeOldPasswordPageRoutingModule } from './change-old-password-routing.module';

import { ChangeOldPasswordPage } from './change-old-password.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ChangeOldPasswordPageRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ChangeOldPasswordPage]
})
export class ChangeOldPasswordPageModule {}
