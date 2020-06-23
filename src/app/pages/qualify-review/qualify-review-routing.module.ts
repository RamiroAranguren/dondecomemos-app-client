import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QualifyReviewPage } from './qualify-review.page';

const routes: Routes = [
  {
    path: '',
    component: QualifyReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QualifyReviewPageRoutingModule {}
