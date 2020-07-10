import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreOrderPageRoutingModule } from './pre-order-routing.module';

import { PreOrderPage } from './pre-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreOrderPageRoutingModule
  ],
  declarations: [PreOrderPage]
})
export class PreOrderPageModule {}
