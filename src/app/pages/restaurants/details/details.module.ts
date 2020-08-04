import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPageRoutingModule } from './details-routing.module';

import { DetailsPage } from './details.page';
import { PipesModule } from '../../../pipes/pipes.module';
import { ModalGaleryPage } from '../../modal-galery/modal-galery.page';
import { ModalGaleryPageModule } from '../../modal-galery/modal-galery.module';
import { NativePageTransitions} from '@ionic-native/native-page-transitions/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

@NgModule({
  entryComponents: [
    ModalGaleryPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    PipesModule,
    ModalGaleryPageModule,
  ],
  providers:[
    AppMinimize
  ],
  declarations: [DetailsPage]
})
export class DetailsPageModule {}
