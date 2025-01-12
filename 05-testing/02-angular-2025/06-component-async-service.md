## Component with async service

```bash
npx ng g s twain
```

Create `quote.ts`

```ts
export interface Quote {
  id: number;
  quote: string;
}
```

Update `twain.service.ts`

```ts
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError, map } from "rxjs";
import { Quote } from "./quote";

@Injectable({
  providedIn: "root",
})
export class TwainService {
  // https://dummyjson.com/docs/quotes#quotes-single
  private url = "https://dummyjson.com/quotes/random";

  constructor(private http: HttpClient) {}

  getQuote(): Observable<string> {
    return this.http.get<Quote>(this.url).pipe(
      map((q: Quote) => q.quote),
      catchError((err) => throwError(() => "Can not get quote"))
    );
  }
}
```

```bash
npx ng g c twain
```

Update `twain.component.ts`

```ts
import { AsyncPipe } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { catchError, Observable, of, startWith } from "rxjs";
import { TwainService } from "./twain.service";

@Component({
  selector: "app-twain",
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
  styles: [".twain { font-style: italic; } .error { color: red; }"],
})
export class TwainComponent implements OnInit {
  errorMessage = signal("");
  quote?: Observable<string>;

  constructor(private twainService: TwainService) {}

  ngOnInit(): void {
    this.getQuote();
  }

  getQuote() {
    this.errorMessage.set("");
    this.quote = this.twainService.getQuote().pipe(
      startWith("..."),
      catchError((err: string) => {
        this.errorMessage.set(err);
        return of("...");
      })
    );
  }
}
```

### Testing with a spy

When testing a component, only the service's public API should matter. In general, tests themselves should not make calls to remote servers.

Update `twain.component.spec.ts`

- [spyOn](https://jasmine.github.io/api/edge/global.html#spyOn)

```ts
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TwainComponent } from "./twain.component";
import { TwainService } from "./twain.service";
import { of, throwError } from "rxjs";
import { provideHttpClient } from "@angular/common/http";

describe("TwainComponent", () => {
  let component: TwainComponent;
  let fixture: ComponentFixture<TwainComponent>;
  let testQuote: string;
  let getQuoteSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TwainComponent],
      providers: [TwainService, provideHttpClient()],
    });
    testQuote = "Test Quote";

    // Create a fake TwainService object with `getQuote()` spy
    const twainService = TestBed.inject(TwainService);
    getQuoteSpy = spyOn(twainService, "getQuote").and.returnValue(
      of(testQuote)
    );

    fixture = TestBed.createComponent(TwainComponent);
    component = fixture.componentInstance;
  });

  it("should display error when TwainService fails", () => {
    getQuoteSpy.and.returnValue(throwError(() => "Test fails"));
    fixture.detectChanges(); // ngOnInit
    const errorElement = fixture.nativeElement.querySelector(".error");
    expect(errorElement.textContent)
      .withContext("should display error")
      .toContain("Test fails");
  });

  it("should show quote after getQuote", () => {
    fixture.detectChanges(); // ngOnInit()
    const element = fixture.nativeElement.querySelector(".twain");
    expect(element.textContent)
      .withContext("should show quote")
      .toBe(testQuote);
  });
});
```

```bash
npx ng test --include app/twain/twain.component.spec.ts
```

The spy is designed such that any call to `getQuote` receives an observable with a test quote. Unlike the real `getQuote()` method, this spy bypasses the server and returns a synchronous observable whose value as available immediately.

> **NOTE**: It is best to limit the usage of spies to only what is necessary for the test. Creating mocks or spies for more than what's necessary can be brittle. As the component and injectable evolves, the unrelated tests can fail because they no longer mock enough behaviors that would otherwise not affect the test.

Notice that we are not able to test the transition between '...' to the 'test quote' text. Why is that? Basically our real service behaves as async and the Spy is behaving as sync, no time for transition here
