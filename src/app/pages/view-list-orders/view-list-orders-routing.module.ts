import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewListOrdersPage } from './view-list-orders.page';

const routes: Routes = [
  {
    path: '',
    component: ViewListOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewListOrdersPageRoutingModule {}
