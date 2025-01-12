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