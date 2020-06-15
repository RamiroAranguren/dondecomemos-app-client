import { Pipe, PipeTransform } from '@angular/core';
import { restaurant } from '../interfaces/restaurant';

@Pipe({
  name: 'level'
})
export class LevelPipe implements PipeTransform {

  transform(restaurant:restaurant): string {
    let level: string = "";
    switch (restaurant.level) {
      case 1:
        level = "$";
        break;
      case 2:
        level = "$$";
        break;
      case 3:
        level = "$$$";
        break;
      case 4:
        level = "$$$$";
        break;
      default:
        level = "$";
        break;
    }

    return level;
  }

}
