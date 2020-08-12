import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenClosePipe } from './open-close.pipe';
import { ChipsPipe } from './chips.pipe';
import { ScorePipe } from './score.pipe';
import { LevelPipe } from './level.pipe';
import { ScoreUserPipe } from './score-user.pipe';
import { FormatDatePipe } from './format-date.pipe';
import { InitialUserPipe } from './initial-user.pipe';
import { PriceItemPipe } from './price-item.pipe';
import { CheckStarPipe } from './check-star.pipe';
import { ValidateDiscountPipe } from './validate-discount.pipe';



@NgModule({
  declarations: [
    OpenClosePipe,
    ChipsPipe,
    ScorePipe,
    LevelPipe,
    ScoreUserPipe,
    FormatDatePipe,
    InitialUserPipe,
    PriceItemPipe,
    CheckStarPipe,
    ValidateDiscountPipe
  ],
  exports: [
    OpenClosePipe,
    ChipsPipe,
    ScorePipe,
    LevelPipe,
    ScoreUserPipe,
    FormatDatePipe,
    InitialUserPipe,
    PriceItemPipe,
    CheckStarPipe,
    ValidateDiscountPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
