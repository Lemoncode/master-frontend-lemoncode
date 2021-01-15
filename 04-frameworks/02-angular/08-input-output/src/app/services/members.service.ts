import { Injectable } from '@angular/core';
import { MemberEntity } from '../model/MemberEntity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<MemberEntity[]> {
    return this.http.get<MemberEntity[]>(`https://api.github.com/orgs/lemoncode/members`);
  }
}
