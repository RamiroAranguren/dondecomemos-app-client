import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import { restaurant } from 'src/app/interfaces/restaurant';


@Pipe({
  name: 'openClose'
})
export class OpenClosePipe implements PipeTransform {

  transform(restaurant:restaurant, close:any=false): string {
    let now = moment();
    let hs_now = restaurant.hours_week.filter(hs => hs.day === now.day().toString());

    let partial_state = "Cerrado";
    let state = false;
    let state_data_list = {
      status: false,
      open: null,
      close: null
    };

    console.log("NOW", now.day(), hs_now, hs_now.length);

    if(close){ // return Full State: date + hs

      if(hs_now.length <= 0) {
        return "Hoy cerrado";
      } else {
        for(var i=0; i< hs_now.length; i++){
          let opensAt = moment(hs_now[i].opening_hour, 'HH:mm:ss');
          let closesAt = moment(hs_now[i].closing_hour, 'HH:mm:ss');
          state_data_list.open = hs_now[i].opening_hour;
          state_data_list.close = hs_now[i].closing_hour;
          if(now.isBetween(opensAt, closesAt)){
            state_data_list.status = true;
            break;
          }
        }
        if(state_data_list.status === true){
          return `Abierto - cierra a las ${state_data_list.close.slice(0,5)}`;
        }
        return `Cerrado - abre a las ${state_data_list.open.slice(0,5)}`;
      }

    } else { // Return Partial State: 'Abierto' - 'Cerrado'

      if(hs_now.length <= 0) {
        return "Cerrado";
      } else {
        hs_now.forEach(hs => {
          let opensAt = moment(hs.opening_hour, 'HH:mm:ss');
          let closesAt = moment(hs.closing_hour, 'HH:mm:ss');
          console.log(opensAt, closesAt, now.isBetween(opensAt, closesAt));
          if(now.isBetween(opensAt, closesAt)){
            partial_state = "Abierto";
          }
        });
        return partial_state;
      }
    }
  }
}
