import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookTablePageRoutingModule } from './book-table-routing.module';

import { BookTablePage } from './book-table.page';
import { ReserveInfoComponent } from 'src/app/components/reserve/reserve-info/reserve-info.component';

@NgModule({
  entryComponents: [
    ReserveInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookTablePageRoutingModule
  ],
  declarations: [BookTablePage]
})
export class BookTablePageModule {}
