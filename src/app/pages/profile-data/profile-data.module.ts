import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileDataPageRoutingModule } from './profile-data-routing.module';

import { ProfileDataPage } from './profile-data.page';

import { SimpleMaskModule } from 'ngx-ion-simple-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfileDataPageRoutingModule,
    SimpleMaskModule
  ],
  declarations: [ProfileDataPage]
})
export class ProfileDataPageModule {}
