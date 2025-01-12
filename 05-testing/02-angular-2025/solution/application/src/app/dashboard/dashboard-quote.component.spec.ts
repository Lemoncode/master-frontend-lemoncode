import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQuoteComponent } from './dashboard-quote.component';
import { Quote } from "../twain/quote";
import { By } from '@angular/platform-browser';

describe('DashboardQuoteComponent', () => {
  let component: DashboardQuoteComponent;
  let fixture: ComponentFixture<DashboardQuoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardQuoteComponent]
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
});
