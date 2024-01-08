# Caching

## Why caching is useful?

Here in the `movie.service`, let's change our `tap` operator to display the retrieved array of movies.

Update `movies/src/app/movies/movie.service.ts`

```diff
  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
-   tap(() => console.log('In http.get pipeline')),
+   tap((m) => console.log(JSON.stringify(m))),
    catchError((err) => this.handleError(err))
  );
```

We use `JSON.stringify` to display the array in a nice JSON format. In the `movie‑list.component`, let's delete the `tap` operator. 

Update `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
  private movieService = inject(MovieService);
  readonly movies$ = this.movieService.movies$.pipe(
-      tap(() => console.log('In component pipeline')),
        catchError((err) => {
          this.errorMessage = err;
          return EMPTY;
        })
  );
```

That minimizes additional information displayed to the console. Now bring up the browser and **open the developer tools**. 

Start on the Home page and refresh the application. Then click the Movie List option. Notice the delay as the list of movies is retrieved. 

When the `movies$` observable emits the next notification with our data, our `tap` operator logs that data to the console. 

Now click Home and click Movie List again. Notice the delay again as it retrieves the product data.

Each time the user accesses the Movie List page, the component is initialized and the HTTP get request is executed. When the user returns to the Home page, the component and our observable are destroyed. The next time the user accesses the Movie List again, the component is initialized again, and the data is retrieved again. 

If you are building a highly transaction‑based application like flight reservations or movie tickets, you may want to always get fresh data, but often data doesn't change that frequently, and some data like U.S. states or our company shipping options change even less. 

In our sample application, our movies list doesn't change very often, so let's consider caching the movie data in our service. That way we can retrieve it one time, cache it, and use the cached values from the service as the user moves through our application. 

## Caching Retrieved Data

We're going to cache data at runtime using `shareReplay`. We're looking at the `product.service`. Let's cache our list of movies.

Open `movies/src/app/movies/movie.service.ts`

```ts
class MovieService {
  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
    catchError((err) => this.handleError(err))
  );
}
```

Here, we retrieve the list of movies and pipe them through a set of operators. Let's add `shareReplay` above the `catchError` in this pipeline.

Update `movies/src/app/movies/movie.service.ts`

```diff
import {
  Observable,
  catchError,
  map,
  of,
+ shareReplay,
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

  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
+   shareReplay(1),
    catchError((err) => this.handleError(err))
  );
```

We'll specify a buffer size of 1. Since an HTTP request is one and done, we only need to replay the one emitted item, which is our array of products. That's it. Bring up the browser, and Refresh.

```bash
npm start
```

Notice the delay in displaying the products. Now click Home and Product List again. Wow! Did you see how fast that page appeared? And no additional logging.

Our observable pipeline replayed the data it already retrieved, improving our application performance. Nice.

So even when the Product List page was destroyed, the shared observable remains and replays as needed.

Going back to the code, the location of the `shareReplay` in the pipeline matters. Let's add a tap after the `shareReplay`.

Update `LCS/src/app/products/product.service.ts`

```diff
readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((p) => console.log(JSON.stringify(p))),
    shareReplay(1),
+   tap(() => console.log('After shareReplay')),
    catchError((err) => this.handleError(err))
  );
```

I'll ignore the parameter and use the console.log to display a message. Looking at the browser, refresh and view the console. We see the logged products and our message. Click Home and click Product List again. Our products are not retrieved again, but our message displays again.

Going back to the code, the operators above the `shareReplay` are executed before the data is cached. They are not re‑executed on the next subscription. The operators after the `shareReplay` do not affect the caching. They are re‑executed on each subscription. 

Let's remove our extra tap operator. Use `shareReplay` as needed to cache observable emissions, and pay attention to the location of the `shareReplay` in the pipeline. 

Update `LCS/src/app/products/product.service.ts`

```diff
readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((p) => console.log(JSON.stringify(p))),
    shareReplay(1),
-   tap(() => console.log('After shareReplay')),
    catchError((err) => this.handleError(err))
  );
```

Let's pull it all together with a brief summary, best practices, and considerations when using the async pipe and caching data.

