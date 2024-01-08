import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, MovieDetailComponent],
  templateUrl: './movie-list.component.html',
  styles: ``,
})
export class MovieListComponent implements OnInit, OnDestroy {
  // Just enough here for the template to compile
  pageTitle = 'Movies';
  errorMessage = '';
  /*diff*/
  sub!: Subscription;
  /*diff*/

  private movieService = inject(MovieService);

  // Movies
  movies: Movie[] = [];

  // Selected movie id to highlight the entry
  selectedMovieId: number = 0;

  ngOnInit(): void {
    this.sub = this.movieService
      .getMovies()
      .pipe(
        tap(() => console.log('In component pipeline')),
        catchError((err) => {
          this.errorMessage = err;
          return EMPTY;
        })
      )
      // .subscribe({
      //   next: (movies) => {
      //     this.movies = movies;
      //     console.log(this.movies);
      //   },
      //   error: (err) => {
      //     this.errorMessage = err;
      //   },
      // });
      .subscribe((movies) => {
        console.log(this.movies);
        this.movies = movies;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
  }
}
