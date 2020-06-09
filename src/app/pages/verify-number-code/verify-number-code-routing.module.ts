import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyNumberCodePage } from './verify-number-code.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyNumberCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyNumberCodePageRoutingModule {}
