import { Pipe, PipeTransform } from '@angular/core';
import { restaurant } from '../interfaces/restaurant';

@Pipe({
  name: 'score'
})
export class ScorePipe implements PipeTransform {

  transform(restaurant:restaurant): string {
    let cantidad_qualify = restaurant.qualifications.length;
    if ( cantidad_qualify > 0) {
      let scores = restaurant.qualifications.map(qualy => qualy.score);
      let score = scores.reduce((previous, current) => previous + current );
      return (score / cantidad_qualify).toFixed(1);
    }
    return "";
  }
}
