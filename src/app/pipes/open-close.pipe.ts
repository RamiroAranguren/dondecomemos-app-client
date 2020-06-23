import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import { restaurant } from 'src/app/interfaces/restaurant';


@Pipe({
  name: 'openClose'
})
export class OpenClosePipe implements PipeTransform {
  format = 'HH:mm:ss'

  transform(restaurant:any, close:any=false): string {
    if(close){

      if(restaurant.hours.length > 0){
        return restaurant.hours[0].closing_hour?.substring(0,5);
      } else {
        return "--"
      }

    } else {

      if(restaurant.hours.length === 0) {
        return "Cerrado";
      }
      if(restaurant.hours.length > 0) {
        let now = moment();
        let opensAt = moment(restaurant.hours[0].opening_hour, this.format);
        let closesAt = moment(restaurant.hours[0].closing_hour, this.format);
        if(now.isBetween(opensAt, closesAt)){
          return "Abierto";
        }
        return "Cerrado";
      }
    }
  }

}
