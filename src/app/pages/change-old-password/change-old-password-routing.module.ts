import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeOldPasswordPage } from './change-old-password.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeOldPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeOldPasswordPageRoutingModule {}
