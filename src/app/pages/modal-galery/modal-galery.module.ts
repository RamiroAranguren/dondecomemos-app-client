import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalGaleryPageRoutingModule } from './modal-galery-routing.module';

import { ModalGaleryPage } from './modal-galery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalGaleryPageRoutingModule
  ],
  declarations: [ModalGaleryPage]
})
export class ModalGaleryPageModule {}
