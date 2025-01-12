import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError, map } from "rxjs";
import { Quote } from "./quote";

@Injectable({
  providedIn: "root",
})
export class TwainService {
  // https://dummyjson.com/docs/quotes#quotes-single
  private baseUrl = "https://dummyjson.com/quotes/random";

  constructor(private http: HttpClient) {}

  getQuote(): Observable<string> {
    return this.http.get<Quote>(`${this.baseUrl}/random`).pipe(
      map((q: Quote) => q.quote),
      catchError((err) => throwError(() => "Can not get quote"))
    );
  }

  getQuotes(): Observable<Quote[]> {
    return this.http.get<{ quotes: any[] }>(`${this.baseUrl}`).pipe(
      map(({ quotes }) => {
        return quotes.map((q) => ({ id: q.id, quote: q.quote }));
      }),
      catchError((err) => throwError(() => 'Can not get quotes'))
    );
  }
}