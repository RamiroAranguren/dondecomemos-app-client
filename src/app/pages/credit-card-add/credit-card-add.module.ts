import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CreditCardAddPageRoutingModule } from './credit-card-add-routing.module';

import { CreditCardAddPage } from './credit-card-add.page';

@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreditCardAddPageRoutingModule
  ],
  declarations: [CreditCardAddPage]
})
export class CreditCardAddPageModule {}
