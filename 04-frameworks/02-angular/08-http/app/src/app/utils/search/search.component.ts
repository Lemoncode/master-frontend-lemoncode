import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Input() ph = 'Buscar...';
  @Input() label = 'Buscar: ';

  name = 'Paco';

  @Output() clickEnLupa: EventEmitter<string> = new EventEmitter();
  @Output() otroEvento = new EventEmitter();

  changeName() {
    this.name = 'Francisco';
    this.clickEnLupa.emit(this.name);
  }
}
