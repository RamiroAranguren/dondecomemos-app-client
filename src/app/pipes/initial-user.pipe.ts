import { Pipe, PipeTransform } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user';

@Pipe({
  name: 'initialUser'
})
export class InitialUserPipe implements PipeTransform {

  transform(user:UserInterface): unknown {
    return `${user.first_name.slice(0, 1)}${user.last_name.slice(0, 1)}`;
  }

}
