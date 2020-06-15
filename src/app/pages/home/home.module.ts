import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ComponentsModule } from '../../components/components.module';
import { FilterModalPage } from '../filter-modal/filter-modal.page';
import { FilterModalPageModule } from '../filter-modal/filter-modal.module';

@NgModule({
  entryComponents: [
    FilterModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule,
    FilterModalPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
