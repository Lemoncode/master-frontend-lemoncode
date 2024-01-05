# Demo: Subscribe to the Returned Observable in a Component

- Retrieving data

  - Subscribe to the returned observable component

Update `movies/src/app/movies/movie-list/movie-list.component.ts`

```ts
export class MovieListComponent {
  // Just enough here for the template to compile
  pageTitle = "Movies";
  errorMessage = "";

  // Movies
  movies: Movie[] = [];

  // Selected movie id to highlight the entry
  selectedMovieId: number = 0;

  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
  }
}
```

We currently init movies to an empty array. First we need to inject `MovieService`:

```diff
# ....
+import { MovieService } from '../movie.service';

# ....
export class MovieListComponent {
  pageTitle = 'Movies';
  errorMessage = '';

+ private movieService = inject(MovieService);

# ....
}
```

We need a place to start the Observable, and remove it when the Component is done, we implement for this purpose `OnInit` and `OnDestroy`.

```ts
import { NgClass, NgFor, NgIf } from "@angular/common";
/*diff*/
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
/*diff*/
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
/*diff*/
import { Subscription, tap } from "rxjs";
/*diff*/

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, MovieDetailComponent],
  templateUrl: './movie-list.component.html',
  styles: ``,
})
export class MovieListComponent implements OnInit, OnDestroy {
  // Just enough here for the template to compile
  pageTitle = "Movies";
  errorMessage = "";
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
      .pipe(tap(() => console.log("In component pipeline")))
      .subscribe((movies) => (this.movies = movies));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  /*diff*/

  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
  }
}
```

```bash
npm start
```

Lets update the code to see the products on console:

```diff
  ngOnInit(): void {
    this.sub = this.movieService
      .getMovies()
      .pipe(tap(() => console.log('In component pipeline')))
-     .subscribe((movies) => (this.movies = movies));
+     .subscribe((movies) => {
+       this.movies = movies;
+       console.log(this.movies);
+     });
```
