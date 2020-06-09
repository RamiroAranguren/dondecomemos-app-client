import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenClosePipe } from './open-close.pipe';



@NgModule({
  declarations: [OpenClosePipe],
  exports: [
    OpenClosePipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
