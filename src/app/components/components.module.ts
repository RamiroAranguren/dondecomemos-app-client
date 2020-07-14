import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { RestaurantComponent } from './restaurant/restaurant/restaurant.component';
import { PipesModule } from '../pipes/pipes.module';
import { ReserveInfoComponent } from './reserve/reserve-info/reserve-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent,
    RestaurantComponent,
    ReserveInfoComponent
  ],
  exports: [
    HeaderComponent,
    RestaurantComponent,
    ReserveInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
