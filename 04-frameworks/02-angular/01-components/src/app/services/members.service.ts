import { Injectable } from '@angular/core';
import { MemberEntity } from '../model/member-entity';


@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor() { }

  getAll(): Promise<MemberEntity[]> {
    return fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json());
      
  }
}
