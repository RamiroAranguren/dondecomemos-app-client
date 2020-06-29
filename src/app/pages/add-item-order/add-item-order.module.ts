import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddItemOrderPageRoutingModule } from './add-item-order-routing.module';

import { AddItemOrderPage } from './add-item-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddItemOrderPageRoutingModule
  ],
  declarations: [AddItemOrderPage]
})
export class AddItemOrderPageModule {}
