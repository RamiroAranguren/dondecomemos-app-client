import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserguestModalPage } from './userguest-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UserguestModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserguestModalPageRoutingModule {}
