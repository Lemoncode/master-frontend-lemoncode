import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TypicodeUser, User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { map, filter, debounceTime, distinctUntilChanged, switchMap, tap, distinct } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  errorMessage: string;
  users: TypicodeUser[];
  emailControl: FormControl = new FormControl();

  constructor(private userService: UserService) {
    this.getUsers().subscribe(users => this.users = users);
  }

  ngOnInit() {

    this.emailControl.valueChanges
    
    .subscribe(
        value => this.getUsers(value).subscribe(
          users => this.users = users,
          error => this.errorMessage =  error as string
        ) 
    );

    // this.emailControl.valueChanges
    // .pipe(
    //   debounceTime(500),
    //   filter(x => x.length > 3 || x.length === 0), 
    //   distinctUntilChanged(),
    //   switchMap((value) => this.getUsers(value))
    // )
    // .subscribe(
    //     users => this.users = users,
    //     error => this.errorMessage =  error as string
    // );

    // this.emailControl.valueChanges
    //   .pipe(
    //     // tap(x => console.log('Elemento original:', x)),
    //     filter(x => x.length > 3 || x.length === 0),
    //     // tap(x => console.log('Después de .filter(x => x.length > 3)', x)),
    //     debounceTime(500),
    //     // tap(x => console.log('Después de .debounceTime(500)', x)),
    //     distinctUntilChanged(),
    //     // tap(x => console.log('Después de .distinctUntilChanged()', x)),
    //     switchMap((x) => this.getUsers(x))
    //     // tap(x => console.log('Después de .switchMap((x) => this.getHeroes(x))', x))
    //   )
    //   .subscribe(users => {this.users = users; console.log(users); },
    //              error =>  this.errorMessage =  error as string
    //   );
  }

  getUsers(email?: string): Observable<TypicodeUser[]> {
    let filter = '';
    if (email) {
      filter = 'email=' + email;
    }
    return this.userService.getFiltered(filter);
  }

}
