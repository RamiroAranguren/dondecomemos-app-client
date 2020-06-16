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
        level = "<b class='level'>$<b><span style='color:red !important'>$$$</span>";
        break;
      case 2:
        level = "<b class='level'>$$</b><span style='color:red !important'>$$</span>";
        break;
      case 3:
        level = "<b class='level'>$$$</b><span style='color:red !important'>$</span>";
        break;
      case 4:
        level = "<b class='level'>$$$$</b>";
        break;
      default:
        level = "<b class='level'>$</b><span style='color:red !important'>$$$</span>";
        break;
    }

    return level;
  }

}
