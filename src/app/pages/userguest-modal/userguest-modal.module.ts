import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserguestModalPageRoutingModule } from './userguest-modal-routing.module';

import { UserguestModalPage } from './userguest-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserguestModalPageRoutingModule
  ],
  declarations: [UserguestModalPage]
})
export class UserguestModalPageModule {}
