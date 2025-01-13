import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { catchError, Observable, of, startWith } from 'rxjs';
import { TwainService } from './twain.service';

@Component({
  selector: 'app-twain',
  imports: [AsyncPipe],
  template: `
    <p class="twain">
      <i>{{ quote | async }}</i>
    </p>
    <button type="button" (click)="getQuote()">Next quote</button>
    @if (errorMessage()) {
    <p class="error">{{ errorMessage() }}</p>
    }
  `,
  styles: ['.twain { font-style: italic; } .error { color: red; }'],
})
export class TwainComponent implements OnInit {
  errorMessage = signal('');
  quote?: Observable<string>;

  constructor(private twainService: TwainService) {}

  ngOnInit(): void {
    this.getQuote();
  }

  getQuote() {
    this.errorMessage.set('');
    this.quote = this.twainService.getQuote().pipe(
      startWith('...'),
      catchError((err: string) => {
        this.errorMessage.set(err);
        return of('...');
      })
    );
  }
}
