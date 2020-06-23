import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalGaleryPage } from './modal-galery.page';

const routes: Routes = [
  {
    path: '',
    component: ModalGaleryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalGaleryPageRoutingModule {}
