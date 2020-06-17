import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditCardListPage } from './credit-card-list.page';

const routes: Routes = [
  {
    path: '',
    component: CreditCardListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardListPageRoutingModule {}
