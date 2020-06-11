import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileFormPageRoutingModule } from './profile-form-routing.module';

import { ProfileFormPage } from './profile-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileFormPageRoutingModule
  ],
  declarations: [ProfileFormPage]
})
export class ProfileFormPageModule {}
