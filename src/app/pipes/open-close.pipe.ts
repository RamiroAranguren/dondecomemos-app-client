import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';


@Pipe({
  name: 'openClose'
})
export class OpenClosePipe implements PipeTransform {
  format = 'HH:mm:ss'

  transform(restaurant:any): string {
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
