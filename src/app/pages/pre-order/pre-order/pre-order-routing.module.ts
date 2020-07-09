import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreOrderPage } from './pre-order.page';

const routes: Routes = [
  {
    path: '',
    component: PreOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreOrderPageRoutingModule {}
