# Demo: Declarative Data Retrieval Pattern

Let's transform the code that retrieves movies from a procedural to a declarative approach.

Update `movies/src/app/movies/movie.service.ts`

```diff
export class MovieService {
  private moviesUrl = 'api/movies';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);
+
+ readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
+   tap(() => console.log('In http.get pipeline')),
+   catchError((err) => this.handleError(err))
+ );
+
- getMovies(): Observable<Movie[]> {
-   return this.http.get<Movie[]>(this.moviesUrl).pipe(
-     tap(() => console.log('In http.get pipeline')),
-     catchError((err) => this.handleError(err))
-   );
- }

```

First, declare a variable. We call it `movies$`, and append a dollar sign to make it clear that it is an observable.

Next, copy the `http.get` including the `pipe`, and asisgn it to the variable declaration. We can delete our method. We now have a variable that represents our observable. We don't want any other code modifying this variable, so let's add `readonly` at the front.

Now this variable is assigned the observable returned from the http.get and never modified. What about this `getMovie` method?

> `getMovie` **later**

How do we pass a parameter in when we use the declarative approach? Handling parameters requires a few more techniques that we'll cover a bit later, so we'll transform the `getMovie` method to a declarative approach later.

Open `movies/src/app/movies/movie-list/movie-list.component.ts`

Looking at the `movie‑list.component`, we now have syntax errors. We no longer have a `getMovies` method. Let's delete the method call and instead reference our property, `movies$`.

Update `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
  ngOnInit(): void {
    this.sub = this.movieService
-   .getMovies()
+   .movies$
      .pipe(
        tap(() => console.log('In component pipeline')),
        catchError((err) => {
          this.errorMessage = err;
          return EMPTY;
        })
      )
      .subscribe((movies) => {
        this.movies = movies;
      });
  }
```

Since the variable is an observable, we can still pipe the results through a set of operators and subscribe to trigger the `http.get`. Will it still work?

```bash
npm start
```

Start the project using Run, Start Debugging. Click on Product List, and we see the list of products. It still works. Going back to the code, let's make the component declarative as well.

Update `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component,
- OnDestroy,
- OnInit,
  inject
} from '@angular/core';
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
// export class MovieListComponent implements OnInit, OnDestroy {
export class MovieListComponent {
  pageTitle = 'Movies';
  errorMessage = '';
- sub!: Subscription;

  private movieService = inject(MovieService);
+ readonly movies$ = this.movieService.movies$.pipe(
+   tap(() => console.log('In component pipeline')),
+       catchError((err) => {
+         this.errorMessage = err;
+         return EMPTY;
+       })
+ );
+
  // Movies
- movies: Movie[] = [];

  // Selected movie id to highlight the entry
  selectedMovieId: number = 0;
-
- ngOnInit(): void {
-   this.sub = this.movieService
-   .movies$
-     .pipe(
-       tap(() => console.log('In component pipeline')),
-       catchError((err) => {
-         this.errorMessage = err;
-         return EMPTY;
-       })
-     )
-     .subscribe((movies) => {
-       this.movies = movies;
-     });
- }
-
- ngOnDestroy(): void {
-   this.sub.unsubscribe();
- }
-
  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
  }
}

```

With a declarative approach, we start by declaring a variable. We call it `movies$`, then we assign the reference to the `movieService.movies$`, including the pipe. We don't need to subscribe. We'll again add `readonly` to the front to ensure this variable is never modified.

We can now delete the `ngOnInit`, and since we are no longer subscribing, we don't need to `unsubscribe`, so we can delete the `ngOnDestroy` as well.

This code now uses a declarative approach, working with our observable directly from the service. We no longer need to manage our state in local variables.

We don't need the `subscription` variable and we don't need our local movies variable. The observable will emit the array of movies for us. We also clean up the import statements.

But looking at the browser, our code no longer works. Our template is using the movies variable we just deleted.

```console
✘ [ERROR] NG1: Property 'movies' does not exist on type 'MovieListComponent'. Did you mean 'movies$'? [plugin angular-compiler]

    src/app/movies/movie-list/movie-list.component.html:13:35:
      13 │               *ngFor="let movie of movies"
         ╵                                    ~~~~~~
```

We'll change the template to access the value emitted from our observable instead. For that, we need the `async` pipe.

## `async` pipe

We want to display retrieved data by working directly with the data emitted from the observable using the `async` pipe.

Open `movies/src/app/movies/movie-list/movie-list.component.html`

> If we have installed VS Code extensions we can see the errors on template

This `ngIf` checks whether there are any movies in the array.

```html
<div class="card-body" *ngIf="movies.length"></div>
```

If so, it displays this div element and its child elements. The `ngFor` loops through the movies array and displays the name of each movie in a button.

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

Looking back at the `movie‑list.component`, we no longer have a movies property. We now have the `movies$` observable that references the observable from the movieService. Let's use the _async pipe_ to work with this observable in our template. 


Update `movies/src/app/movies/movie-list/movie-list.component.html`

```diff
-   <div class="card-body" *ngIf="movies.length">
+   <div class="card-body" *ngIf="movies$ | async">
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

Now it only displays this div element when the observable emits something. But we're getting a syntax error when we try to use the `async` pipe. Any guesses why? Here's a hint. We're using standalone components.

Update `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
-import { NgClass, NgFor, NgIf } from '@angular/common';
+import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, 
  inject 
} from '@angular/core';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { MovieService } from '../movie.service';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  standalone: true,
- imports: [NgIf, NgClass, NgFor, MovieDetailComponent],
+ imports: [NgIf, NgClass, NgFor, MovieDetailComponent, AsyncPipe],
  templateUrl: './movie-list.component.html',
  styles: ``,
})
```

When using standalone components, we need to import everything that the template needs as part of the component metadata. We do that here on the imports array. The template wants to use the async pipe, so we add `AsyncPipe` to the imports array. 

Update `movies/src/app/movies/movie-list/movie-list.component.html`

```diff
<div class="card-body" *ngIf="movies$ | async">
    <div class="list-group">
    <button
        type="button"
        class="list-group-item"
-       *ngFor="let movie of movies"
+       *ngFor="let movie of movies$ | async"
        [ngClass]="{ active: movie.id === selectedMovieId }"
        (click)="onSelected(movie.id)"
    >
        {{ movie.movieName }}
    </button>
    </div>
</div>
```

Back in the template, we have now told Angular that we're using the async pipe in this component, so it no longer has a syntax error. 

Let's check it out in the browser, and our movie list appears. We are now displaying the array directly as it is emitted from the observable. 

But there may be a problem here. Let's _open the developer tools_. 

> We get two sets of messages from our pipeline.

Why is that? Going back to the code, here in the template, each async pipe subscribes to the `movies$` observable. **Two async pipes for the same observable means we are subscribing twice and issuing the HTTP get request twice**. That's not good. We should instead use the `as` clause.

Update `movies/src/app/movies/movie-list/movie-list.component.html`

```diff
-<div class="card-body" *ngIf="movies$ | async">
+<div class="card-body" *ngIf="movies$ | async as movies">
    <div class="list-group">
    <button
        type="button"
        class="list-group-item"
-       *ngFor="let movie of movies$ | async"
+       *ngFor="let movie of movies"
        [ngClass]="{ active: movie.id === selectedMovieId }"
        (click)="onSelected(movie.id)"
    >
        {{ movie.movieName }}
    </button>
    </div>
</div>
```

Here in the `ngIf`, we'll add as movies. The emitted item is retained in the defined template variable called movies. We can access that variable anywhere within the HTML element that has the `ngIf` directive and any of its children. So in the `ngFor`, instead of another `async` pipe, we use the movies template variable.

> Now we only have one `async` pipe, and therefore one subscription.

Bring up the browser, we still see the list of movies, and we see only one message from each of our two pipelines.

In this demo, we used the async pipe to directly access the value emitted from our observable, and we used the `as` clause to hold that value so it can be used elsewhere within the HTML element.
