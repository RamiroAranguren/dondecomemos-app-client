import { Pipe, PipeTransform } from '@angular/core';
import { restaurant } from '../interfaces/restaurant';

@Pipe({
  name: 'level'
})
export class LevelPipe implements PipeTransform {

  transform(restaurant:restaurant, index:string): string {
    switch (restaurant.level) {
      case 1:
        return index === '0' ? "$" : "$$$$";
      case 2:
        return index === '0' ? "$$" : "$$$";
      case 3:
        return index === '0' ? "$$$" : "$$";
      case 4:
        return index === '0' ? "$$$$" : "$";
      case 5:
        return index === '0' ? "$$$$$" : "";
      default:
        return index === '0' ? "$" : "$$$";
    }
  }

}
