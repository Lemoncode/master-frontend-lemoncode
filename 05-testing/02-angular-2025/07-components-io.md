# Component with inputs and outputs

A component with inputs and outputs typically appears inside the view template of a host component. The host uses a property binding to set the input property and an event binding to listen to events raised by the output property.

The testing goal is to verify that such bindings work as expected. The tests should set input values and listen for output events.

```bash
npx ng g c dashboard
```

```bash
npx ng g c dashboard/dashboard-quote --inline-template --flat
```

Update `dashnoard-quote.component.ts`

```ts
import { Component, input, output } from "@angular/core";
import { Quote } from "../twain/quote";

@Component({
  selector: "app-dashboard-quote",
  imports: [],
  template: `
    <button type="button" (click)="click()" class="quote">
      {{ quote().quote }}
    </button>
  `,
  styleUrl: "./dashboard-quote.component.css",
})
export class DashboardQuoteComponent {
  quote = input.required<Quote>();
  selected = output<Quote>();

  click() {
    this.selected.emit(this.quote());
  }
}
```

Update `dashnoard-quote.component.css`

```css
.quote {
  padding: 20px;
  position: relative;
  text-align: center;
  color: #eee;
  max-height: 120px;
  width: 100%;
  min-width: 120px;
  background-color: #607d8b;
  border-radius: 2px;
}

.quote:hover {
  background-color: #eee;
  cursor: pointer;
  color: #607d8b;
}

@media (max-width: 600px) {
  .quote {
    font-size: 10px;
    max-height: 75px;
  }
}

@media (max-width: 1024px) {
  .quote {
    min-width: 60px;
  }
}
```

Update `twain/twain.service.ts`

```diff
@Injectable({
  providedIn: 'root',
})
export class TwainService {
- private url = 'https://dummyjson.com/quotesrandom';
+ private baseUrl = 'https://dummyjson.com/quotes';

  constructor(private http: HttpClient) {}

  getQuote(): Observable<string> {
-   return this.http.get<Quote>(this.url).pipe(
+   return this.http.get<Quote>(`${this.baseUrl}/random`).pipe(
      map((q: Quote) => q.quote),
      catchError((err) => throwError(() => 'Can not get quote'))
    );
  }
+
+ getQuotes(): Observable<Quote[]> {
+   return this.http.get<{ quotes: any[] }>(`${this.baseUrl}`).pipe(
+     map(({ quotes }) => {
+       return quotes.map((q) => ({ id: q.id, quote: q.quote }));
+     }),
+     catchError((err) => throwError(() => 'Can not get quotes'))
+   );
+ }
}
```

Update `dashboard.component.html`

```html
<h2>{{ title }}</h2>

<div class="grid grid-pad">
  @for (quote of quotes; track quote) {
  <app-dashboard-quote
    class="col-1-4"
    [quote]="quote"
    (selected)="gotoDetail($any($event))"
  ></app-dashboard-quote>
  }
</div>
```

Update `dashboard.component.ts`

```ts
import { Component, OnInit } from "@angular/core";
import { Quote } from "../twain/quote";
import { TwainService } from "../twain/twain.service";
import { DashboardQuoteComponent } from "./dashboard-quote.component";

@Component({
  selector: "app-dashboard",
  imports: [DashboardQuoteComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
  quotes: Quote[] = [];

  constructor(private quoteService: TwainService) {}

  ngOnInit(): void {
    this.quoteService
      .getQuotes()
      .subscribe((quotes) => (this.quotes = quotes.slice(1, 5)));
  }

  gotoDetail(quote: Quote) {
    // TODO: Navigate to detail page
    console.log(quote);
  }

  get title() {
    const cnt = this.quotes.length;
    return cnt === 0 ? "No quotes" : `Top ${cnt} quotes`;
  }
}
```

Update `dashboard.component.css`

```css
[class*="col-"] {
  float: left;
}
*,
*::after,
*::before {
  box-sizing: border-box;
}
h3 {
  text-align: center;
  margin-bottom: 0;
}
[class*="col-"] {
  padding-right: 20px;
  padding-bottom: 20px;
}
[class*="col-"]:last-of-type {
  padding-right: 0;
}
.grid {
  margin: 0;
}
.col-1-4 {
  width: 25%;
}
.grid-pad {
  padding: 10px 0;
}
.grid-pad > [class*="col-"]:last-of-type {
  padding-right: 20px;
}
@media (max-width: 1024px) {
  .grid {
    margin: 0;
  }
}
```

### Test `DashboardQuoteComponent` standalone

Update `dashboard-quote.component.spec.ts`

```ts
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardQuoteComponent } from "./dashboard-quote.component";
import { Quote } from "../twain/quote";

describe("DashboardQuoteComponent", () => {
  let component: DashboardQuoteComponent;
  let fixture: ComponentFixture<DashboardQuoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardQuoteComponent],
    });

    fixture = TestBed.createComponent(DashboardQuoteComponent);
    component = fixture.componentInstance;
  });

  it("should display quote", async () => {
    const quoteEl = fixture.nativeElement.querySelector(".quote");
    const expectedQuote: Quote = {
      id: 1,
      quote: "All people live expecting die",
    };
    fixture.componentRef.setInput("quote", expectedQuote);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(quoteEl.textContent).toContain(expectedQuote.quote);
  });
});
```

```bash
npx ng test --include app/dashboard/dashboard-quote.component.spec.ts
```

### Clicking

Update `dashboard-quote.component.spec.ts`

```diff
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQuoteComponent } from './dashboard-quote.component';
import { Quote } from "../twain/quote";
+import { By } from '@angular/platform-browser';
....
```

```ts
// ....
it("should raise selected event when clicked (triggerEventHandler)", async () => {
  const quoteDe = fixture.debugElement.query(By.css(".quote"));
  const expectedQuote: Quote = {
    id: 1,
    quote: "All people live expecting die",
  };
  fixture.componentRef.setInput("quote", expectedQuote);
  fixture.detectChanges();
  await fixture.whenStable();

  let selectedQuote: Quote | undefined;
  component.selected.subscribe((quote: Quote) => (selectedQuote = quote));
  quoteDe.triggerEventHandler("click");
  expect(selectedQuote).toBe(expectedQuote);
});
// ....
```

The component's selected property returns an `EventEmitter`, which looks like an RxJS synchronous `Observable` to consumers. The test subscribes to it _explicitly_ just as the host component does _implicitly_.

### `triggerEventHandler`

The Angular `DebugElement.triggerEventHandler` can raise _any data-bound event_ by its event name. The second parameter is the event object passed to the handler.

### Click the element

```ts
// ....
it("should raise selected event when clicked (element.click)", async () => {
  const quoteEl = fixture.nativeElement.querySelector(".quote");
  const expectedQuote: Quote = {
    id: 1,
    quote: "All people live expecting die",
  };
  fixture.componentRef.setInput("quote", expectedQuote);
  fixture.detectChanges();
  await fixture.whenStable();

  let selectedQuote: Quote | undefined;
  component.selected.subscribe((quote: Quote) => (selectedQuote = quote));

  quoteEl.click();
  expect(selectedQuote).toBe(expectedQuote);
});
// ....
```

> Call native's element own `click()`
