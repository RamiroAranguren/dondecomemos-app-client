import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewListOrdersPageRoutingModule } from './view-list-orders-routing.module';

import { ViewListOrdersPage } from './view-list-orders.page';
import { PipesModule } from '../../pipes/pipes.module';
import { MercadoPagoModalPage } from '../mercado-pago-modal/mercado-pago-modal.page';
import { MercadoPagoModalPageModule } from '../mercado-pago-modal/mercado-pago-modal.module';

@NgModule({
  entryComponents: [
    MercadoPagoModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ViewListOrdersPageRoutingModule,
    MercadoPagoModalPageModule
  ],
  declarations: [ViewListOrdersPage]
})
export class ViewListOrdersPageModule {}
