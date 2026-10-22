import { Pipe, PipeTransform } from '@angular/core';
import { MemberEntity } from '../models';

@Pipe({
  name: 'searchByLogin',
})
export class SearchByLoginPipe implements PipeTransform {
  transform(members: MemberEntity[], value: string): MemberEntity[] {
    return members.filter((m) => m.login.toLowerCase().includes(value.toLowerCase()));
  }
}
