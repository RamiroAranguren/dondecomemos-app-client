import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditCardListPageRoutingModule } from './credit-card-list-routing.module';

import { CreditCardListPage } from './credit-card-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditCardListPageRoutingModule
  ],
  declarations: [CreditCardListPage]
})
export class CreditCardListPageModule {}
