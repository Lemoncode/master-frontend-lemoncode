import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  @Input() ph = 'Buscar...';
  @Input() label = 'Buscar';

  name = 'Paco';

  @Output() clickEnLupa: EventEmitter<string> = new EventEmitter();
  @Output() otroEvento = new EventEmitter();

  changeName() {
    this.name = 'Francisco';
    this.clickEnLupa.emit(this.name)
  }
}
