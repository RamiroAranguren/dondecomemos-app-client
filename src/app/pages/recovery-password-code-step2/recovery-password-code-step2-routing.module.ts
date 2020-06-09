import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoveryPasswordCodeStep2Page } from './recovery-password-code-step2.page';

const routes: Routes = [
  {
    path: '',
    component: RecoveryPasswordCodeStep2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoveryPasswordCodeStep2PageRoutingModule {}
