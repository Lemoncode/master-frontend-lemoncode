# Component inside a test host

`DashboardComponent` hosts `DashboardQuoteComponent` collection. In the following test we test that a collection is render as we expected.

Update `dashboard/dashboard.component.spec.ts`

```ts
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardComponent } from "./dashboard.component";
import { DashboardQuoteComponent } from "./dashboard-quote.component";
import { TwainService } from "../twain/twain.service";
import { provideHttpClient } from "@angular/common/http";
import { Quote } from "../twain/quote";
import { asyncData } from "../async-observable-helpers";

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let testQuotes: Quote[];
  let getQuotesSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, DashboardQuoteComponent],
      providers: [TwainService, provideHttpClient()],
    }).compileComponents();
    testQuotes = [
      { id: 1, quote: "Foo quote" },
      { id: 2, quote: "Boo quote" },
      { id: 3, quote: "Other quote" },
    ];

    // Create a fake TwainService (async) object
    const twainService = TestBed.inject(TwainService);
    getQuotesSpy = spyOn(twainService, "getQuotes").and.returnValue(
      asyncData(testQuotes)
    );

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it("should display a collection of DashboardQuoteComponents", async () => {
    fixture.detectChanges(); // ngOnInit
    // expect no elements
    await fixture.whenStable();
    fixture.detectChanges(); // update view with quote
    const quoteElements = fixture.nativeElement.querySelectorAll(".quote");
    expect(quoteElements.length).toBe(2);
  });

  it("should display a title with that contains Top 2", async () => {
    fixture.detectChanges(); // ngOnInit
    // expect no elements
    await fixture.whenStable();
    fixture.detectChanges(); // update view with quote
    expect(component.title).toContain("Top 2 quotes");
  });
});
```

```bash
npx ng test --include app/dashboard/dashboard.component.spec.ts
```