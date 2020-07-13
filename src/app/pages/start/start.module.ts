import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

import { IonicModule } from '@ionic/angular';

import { StartPageRoutingModule } from './start-routing.module';

import { StartPage } from './start.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartPageRoutingModule,
  
  ],
  declarations: [StartPage],
  providers:[
    AppMinimize
  ]
})
export class StartPageModule {}
