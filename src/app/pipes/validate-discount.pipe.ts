import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'validateDiscount'
})
export class ValidateDiscountPipe implements PipeTransform {

  transform(discount:any): boolean {
    let now = moment();
    // VALIDAR SI DATE_DISCOUNT ES IGUAL A HOY
    if(now.format('YYYY-MM-DD').toString() === discount.date_discount){
      return true;
    }
    // VALIDAR SI EL DIA DE HOY ESTA INCLUIDO DENTRO DE LA LISTA DE DIAS DE
    // DESCUENTOS
    let list_days = [];
    if(discount.sunday){ list_days.push(0)}
    if(discount.monday){ list_days.push(1)}
    if(discount.tuesday){ list_days.push(2)}
    if(discount.wednesday){ list_days.push(3)}
    if(discount.thursday){ list_days.push(4)}
    if(discount.friday){ list_days.push(5)}
    if(discount.saturday){ list_days.push(6)}

    if(list_days.includes(now.day())){
      return true;
    }
    return false;
  }

}
