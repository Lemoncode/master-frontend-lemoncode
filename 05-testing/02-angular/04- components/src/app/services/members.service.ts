import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MemberEntity } from 'src/app/model/MemberEntity';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<MemberEntity[]> {
    return this.http.get<MemberEntity[]>(`https://api.github.com/orgs/lemoncode/members`);
  }
}
