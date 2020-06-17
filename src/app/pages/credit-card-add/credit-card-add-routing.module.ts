import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditCardAddPage } from './credit-card-add.page';

const routes: Routes = [
  {
    path: '',
    component: CreditCardAddPage,
     children: [
      {
        path: 'credit-card-list',
        loadChildren: () => import('../credit-card-list/credit-card-list.module').then( m => m.CreditCardListPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardAddPageRoutingModule {}
