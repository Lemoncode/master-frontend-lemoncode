import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Movie } from './movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/movies';

  private http = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.moviesUrl)
      .pipe(tap(() => console.log('In http.get pipeline')));
  }

  /*diff*/
  getProduct(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http
      .get<Movie>(movieUrl)
      .pipe(tap(() => console.log("In http.get by id pipeline")));
  }
  /*diff*/
}
