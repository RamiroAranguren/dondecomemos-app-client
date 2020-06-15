import { Pipe, PipeTransform } from '@angular/core';
import { restaurant } from '../interfaces/restaurant';

@Pipe({
  name: 'chips'
})
export class ChipsPipe implements PipeTransform {

  transform(restaurant:restaurant): string {
    let chips = []
    restaurant.chips.map((chip, index) =>{
      if (index <= 1){
        chips.push(chip.tag.name);
      }
    });
    return chips.join("/");
  }

}
