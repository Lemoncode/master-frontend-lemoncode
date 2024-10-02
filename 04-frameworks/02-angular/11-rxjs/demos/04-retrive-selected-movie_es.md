# Demo: Recupear un Item por Id

- Recuperar los datos

  - Recuperar un único producto por id

Actualizar `movies/src/app/movies/movie.service.ts`

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

¿Dónde llamaremos a este método? En `movies/src/app/movies/movie-list/movie-list.component.html`

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

Tenemos un método `onSelected(movie.id)`que establece el id del *movie* seleccionado, si bajamos un poco más en el documento encontraremos el componente `app-movie-detail` que está esperando una *input property* con el valor del *movie id*:

```html
<div class="col-md-8">
  <app-movie-detail [movieId]="selectedMovieId" />
</div>
```

- Actualizar `movies/src/app/movies/movie-detail/movie-detail.component.ts`

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
  selector: "app-movie-detail",
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  templateUrl: "./movie-detail.component.html",
  styles: ``,
})
export class MovieDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input() movieId: number = 0;
  errorMessage = "";
  /*diff*/
  sub!: Subscription;
  /*diff*/

  // Movie to display
  movie: Movie | null = null;

  // Set the page title
  pageTitle = this.movie
    ? `Movie Detail for: ${this.movie.movieName}`
    : "Movie Detail";

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
  addToCart(movie: Movie) {}
}
```
