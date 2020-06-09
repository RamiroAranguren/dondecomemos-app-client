import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoveryPasswordEmailStep1Page } from './recovery-password-email-step1.page';

const routes: Routes = [
  {
    path: '',
    component: RecoveryPasswordEmailStep1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoveryPasswordEmailStep1PageRoutingModule {}
