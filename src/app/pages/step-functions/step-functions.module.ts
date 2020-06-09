import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepFunctionsPageRoutingModule } from './step-functions-routing.module';

import { StepFunctionsPage } from './step-functions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepFunctionsPageRoutingModule
  ],
  declarations: [StepFunctionsPage]
})
export class StepFunctionsPageModule {}
