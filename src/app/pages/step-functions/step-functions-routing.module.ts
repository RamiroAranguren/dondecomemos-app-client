import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFunctionsPage } from './step-functions.page';

const routes: Routes = [
  {
    path: '',
    component: StepFunctionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFunctionsPageRoutingModule {}
