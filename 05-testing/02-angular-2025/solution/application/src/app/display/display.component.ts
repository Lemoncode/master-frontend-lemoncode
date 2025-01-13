import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-display',
  imports: [],
  template: `
    <input (input)="onChange($event)" />
    <span>{{ myInput() }}</span>
  `,
  styles: ``,
})
export class DisplayComponent {
  myInput = signal('');
  onChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.myInput.set(inputValue);
  }
}
