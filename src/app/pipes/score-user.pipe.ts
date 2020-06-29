import { Pipe, PipeTransform } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user';
import { restaurant } from 'src/app/interfaces/restaurant';

@Pipe({
  name: 'scoreUser'
})
export class ScoreUserPipe implements PipeTransform {

  transform(restaurant:restaurant, user:UserInterface): string {

    let cantidad_qualify = restaurant.qualifications.length;
    if ( cantidad_qualify > 0) {
      let user_list = restaurant.qualifications.filter(qualy => qualy.create_user.id === user.id );
      let scores_user = user_list.map(qualy => qualy.score);
      let score = scores_user.reduce((previous, current) => previous + current, 0);
      let result = (score / cantidad_qualify).toFixed(1);

      if (result === '0.0')
        return ""
      return result;
    }
    return "";

  }

}
