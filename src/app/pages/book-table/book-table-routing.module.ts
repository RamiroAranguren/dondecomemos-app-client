import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookTablePage } from './book-table.page';

const routes: Routes = [
  {
    path: '',
    component: BookTablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookTablePageRoutingModule {}
