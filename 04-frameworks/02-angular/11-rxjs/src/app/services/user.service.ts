import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'users';
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getFiltered(filter = ''): Observable<any> {
    return this.http.get(this.apiUrl + '?' + filter)
    .pipe(
      retry(1)
    );
  }

  getOne(id): Observable<any> {
    return this.http.get<User>(this.apiUrl + '/' + id);
  }

  add(user: User) {
    return this.http.post(this.apiUrl, user);
  }

  edit(user: User) {
    return this.http.put(this.apiUrl + '/' + user.id, user);
  }

  delete(id) {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
