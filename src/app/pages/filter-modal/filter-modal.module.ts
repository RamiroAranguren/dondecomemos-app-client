import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FilterModalPage } from './filter-modal.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule
  ],
  declarations: [FilterModalPage]
})
export class FilterModalPageModule {}
