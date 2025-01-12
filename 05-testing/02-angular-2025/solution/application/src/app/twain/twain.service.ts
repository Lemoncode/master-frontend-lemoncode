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