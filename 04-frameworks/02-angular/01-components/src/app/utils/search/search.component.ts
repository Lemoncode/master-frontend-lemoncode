import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() ph = 'Buscar...';
  @Input() label = 'Buscar: ';
  name = 'Carlos';

  @Output() clickEnLupa: EventEmitter<string> = new EventEmitter();
  @Output() otroEvento = new EventEmitter();

  constructor() {

    setTimeout(() => {
      this.name = 'María';
      //this.clickEnLupa.emit(this.name);
    }, 3000);

  }

  ngOnInit(): void {
  }

  changeName() {
    this.name = 'Francisco';
    this.clickEnLupa.emit(this.name);
  }

}
