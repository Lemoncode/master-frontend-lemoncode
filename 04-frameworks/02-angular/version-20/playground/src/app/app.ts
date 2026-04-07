import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Search } from './utils/search/search';
import { UserList } from './user/user-list/user-list';
import { Menu } from './layout/menu/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Search, UserList, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'pplayground';

  escribeLog(name: string) {
    console.log(name);
  }
}
