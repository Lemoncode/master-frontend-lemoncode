import { Pipe, PipeTransform } from '@angular/core';
import { MemberEntity } from '../model';

@Pipe({
  name: 'searchByLogin',
  standalone: true,
})
export class SearchByLoginPipe implements PipeTransform {
  transform(members: MemberEntity[], value: string): MemberEntity[] {
    return members.filter((m) =>
      m.login.toLowerCase().includes(value.toLowerCase())
    );
  }
}
