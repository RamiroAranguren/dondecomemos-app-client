import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QualifyReviewPageRoutingModule } from './qualify-review-routing.module';

import { QualifyReviewPage } from './qualify-review.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QualifyReviewPageRoutingModule,
    PipesModule
  ],
  declarations: [QualifyReviewPage]
})
export class QualifyReviewPageModule {}
