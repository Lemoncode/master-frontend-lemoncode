import { Component } from '@angular/core';
import { Highlight } from '../../directives/highlight';

@Component({
  selector: 'app-menu',
  imports: [Highlight],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  public variableColorEnElTLS = 'pink'
}
