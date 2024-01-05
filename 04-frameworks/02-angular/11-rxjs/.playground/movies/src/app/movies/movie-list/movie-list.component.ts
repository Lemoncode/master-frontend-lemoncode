import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { Subscription, tap } from 'rxjs';

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

  /*diff*/
  ngOnInit(): void {
    this.sub = this.movieService
      .getMovies()
      .pipe(tap(() => console.log('In component pipeline')))
      // .subscribe((movies) => (this.movies = movies));
      .subscribe((movies) => {
        this.movies = movies;
        console.log(this.movies);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  /*diff*/

  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
  }
}
