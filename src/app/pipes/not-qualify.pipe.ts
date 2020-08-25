import { Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';

@Pipe({
  name: 'notQualify'
})
export class NotQualifyPipe implements PipeTransform {

  transform(item:any, ids:any): boolean {
    console.log(ids, item.id, ids.includes(item.id));
    return !ids.includes(item.id);
  }

}
