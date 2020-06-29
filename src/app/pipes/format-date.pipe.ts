import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string): string {
    let date = value.split(" ");
    return `${date[0]} de ${date[1]} de ${date[2]}`;
  }

}
