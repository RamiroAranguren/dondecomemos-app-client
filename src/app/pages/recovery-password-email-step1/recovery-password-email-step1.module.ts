import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoveryPasswordEmailStep1PageRoutingModule } from './recovery-password-email-step1-routing.module';

import { RecoveryPasswordEmailStep1Page } from './recovery-password-email-step1.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    RecoveryPasswordEmailStep1PageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [RecoveryPasswordEmailStep1Page]
})
export class RecoveryPasswordEmailStep1PageModule {}
