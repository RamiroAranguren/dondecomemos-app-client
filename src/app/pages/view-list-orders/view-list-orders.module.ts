import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewListOrdersPageRoutingModule } from './view-list-orders-routing.module';

import { ViewListOrdersPage } from './view-list-orders.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ViewListOrdersPageRoutingModule
  ],
  declarations: [ViewListOrdersPage]
})
export class ViewListOrdersPageModule {}
