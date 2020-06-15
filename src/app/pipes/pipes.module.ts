import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenClosePipe } from './open-close.pipe';
import { ChipsPipe } from './chips.pipe';
import { ScorePipe } from './score.pipe';
import { LevelPipe } from './level.pipe';



@NgModule({
  declarations: [OpenClosePipe, ChipsPipe, ScorePipe, LevelPipe],
  exports: [
    OpenClosePipe,
    ChipsPipe,
    ScorePipe,
    LevelPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
