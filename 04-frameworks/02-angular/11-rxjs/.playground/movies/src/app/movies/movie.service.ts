import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Movie } from './movie';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/movies';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  // movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  private movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  readonly movieSelected$ = this.movieSelectedSubject.asObservable();

  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
    shareReplay(1),
    // tap(() => console.log('After shareReplay')),
    catchError((err) => this.handleError(err))
  );

  getMovie(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http.get<Movie>(movieUrl).pipe(
      tap(() => console.log('In http.get by id pipeline')),
      switchMap((m) => this.getMoviesWithReviews(m)),
      catchError(this.handleError)
    );
  }

  private getMoviesWithReviews(movie: Movie): Observable<Movie> {
    if (movie.hasReviews) {
      this.http.get<Review[]>(this.reviewService.getReviewUrl(movie.id)).pipe(
        map(
          (reviews) =>
            ({
              ...movie,
              reviews,
            } as Movie)
        )
      );
    }
    return of(movie);
  }

  movieSelected(selectedMovieId: number): void {
    this.movieSelectedSubject.next(selectedMovieId);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formatted = this.errorService.formatError(err);
    return throwError(() => formatted);
  }
}
