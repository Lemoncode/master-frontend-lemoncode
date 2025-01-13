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