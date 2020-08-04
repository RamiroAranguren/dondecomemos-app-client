import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ComponentsModule } from '../../components/components.module';
import { FilterModalPage } from '../filter-modal/filter-modal.page';
import { FilterModalPageModule } from '../filter-modal/filter-modal.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

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
    FilterModalPageModule,
    PipesModule
  ],
  providers:[
    AppMinimize
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
