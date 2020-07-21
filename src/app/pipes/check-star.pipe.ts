import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkStar'
})
export class CheckStarPipe implements PipeTransform {

  transform(rate: number, item:number): string {
    if (item <= rate){
      return '../../../../assets/icon/calificaciones/star-completo.svg';
    } else {
      return '../../../../assets/icon/calificaciones/star-vacia.svg';
    }
  }

}
