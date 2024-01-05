import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorService {
  formatError(err: HttpErrorResponse): string {
    return this.httpErrorFormatter(err);
  }

  private httpErrorFormatter(err: HttpErrorResponse): string {
    // In a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    // console.error(err);
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.statusText}`;
    }
    return errorMessage;
  }
}
