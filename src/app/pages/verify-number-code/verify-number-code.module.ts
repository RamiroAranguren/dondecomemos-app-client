import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyNumberCodePageRoutingModule } from './verify-number-code-routing.module';

import { VerifyNumberCodePage } from './verify-number-code.page';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    VerifyNumberCodePageRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [VerifyNumberCodePage]
})
export class VerifyNumberCodePageModule {}
