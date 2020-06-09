import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoveryPasswordCodeStep2PageRoutingModule } from './recovery-password-code-step2-routing.module';

import { RecoveryPasswordCodeStep2Page } from './recovery-password-code-step2.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    RecoveryPasswordCodeStep2PageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [RecoveryPasswordCodeStep2Page]
})
export class RecoveryPasswordCodeStep2PageModule {}
