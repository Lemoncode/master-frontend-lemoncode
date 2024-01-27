# Demo: Retrieve One Item by Id

- Retrieving data

  - Retrieve a single product by id

Update `movies/src/app/movies/movie.service.ts`

```ts
export class MovieService {
  private moviesUrl = "api/movies";

  private http = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.moviesUrl)
      .pipe(tap(() => console.log("In http.get pipeline")));
  }

  /*diff*/
  getMovie(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http
      .get<Movie>(movieUrl)
      .pipe(tap(() => console.log("In http.get by id pipeline")));
  }
  /*diff*/
}
```

Where do we call this method? On `movies/src/app/movies/movie-list/movie-list.component.html`

```html
<div class="card-body" *ngIf="movies.length">
  <div class="list-group">
    <button
      type="button"
      class="list-group-item"
      *ngFor="let movie of movies"
      [ngClass]="{ active: movie.id === selectedMovieId }"
      (click)="onSelected(movie.id)"
    >
      {{ movie.movieName }}
    </button>
  </div>
</div>
```

We have a method `onSelected(movie.id)` that sets up the selected movie id, if we have a look down we will find out `app-movie-detail` component that is expecting an input property with the product id value:

```html
<div class="col-md-8">
  <app-movie-detail [movieId]="selectedMovieId" />
</div>
```

- Update `movies/src/app/movies/movie-detail/movie-detail.component.ts`

```ts
import { CurrencyPipe, NgFor, NgIf } from "@angular/common";
import {
  Component,
  Input,
  OnChanges /*diff*/,
  OnDestroy /*diff*/,
  SimpleChanges /*diff*/,
  inject /*diff*/,
} from "@angular/core";
import { Moviw } from "../movie";
import { MovieService } from "../product.service"; /*diff*/
import { Subscription } from "rxjs"; /*diff*/

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  templateUrl: './movie-detail.component.html',
  styles: ``
})
export class MovieDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input() movieId: number = 0;
  errorMessage = '';
  /*diff*/
  sub!: Subscription;
  /*diff*/

  // Movie to display
  movie: Movie | null = null;

  // Set the page title
  pageTitle = this.movie ? `Movie Detail for: ${this.movie.movieName}` : 'Movie Detail';

  /*diff*/
  private movieService = inject(MovieService);
  /*diff*/

  /*diff*/
  ngOnChanges(changes: SimpleChanges): void {
    const id = changes["movieId"].currentValue;
    if (id > 0) {
      this.sub = this.movieService
        .getMovie(id)
        .subscribe((movie) => (this.movie = movie));
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  /*diff*/
  addToCart(movie: Movie) {
  }
}

```
