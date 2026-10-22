import { Injectable } from '@angular/core';
import { MemberEntity } from '../models';

@Injectable({
  providedIn: 'root',
})
export class Members {
  getAll(): Promise<MemberEntity[]> {
    return fetch('https://api.github.com/orgs/lemoncode/members').then((r) => r.json());
  }
}
