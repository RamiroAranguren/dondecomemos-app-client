import { Pipe, PipeTransform } from '@angular/core';
import { restaurant } from '../interfaces/restaurant';

@Pipe({
  name: 'chips'
})
export class ChipsPipe implements PipeTransform {

  transform(restaurant:restaurant, format=null): string {
    let chips = [];
    restaurant.chips.map((chip, index) =>{
      if (index <= 1){
        chips.push(chip.tag.name);
      }
    });
    if(format !== null){
      return chips.join(" / <br>");
    }
    return chips.join(" / ");
  }

}
