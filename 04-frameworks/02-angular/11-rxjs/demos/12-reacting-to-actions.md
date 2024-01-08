# Reacting to Actions

## Reacting to Actions and Getting Data

In this demo, we react to a notification and retrieve data. 

Open `LCS/src/app/products/product.service.ts`

```ts
class ProductService {
  // ....
  readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((p) => console.log(JSON.stringify(p))),
    shareReplay(1),
    catchError((err) => this.handleError(err))
  );

  getProduct(id: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(productUrl).pipe(
      tap(() => console.log("In http.get by id pipeline")),
      switchMap((p) => this.getProductsWithReviews(p)),
      catchError((err) => this.handleError(err))
    );
  }
  // ....
}
```

Recall from earlier in this course that we changed this retrieve to use a declarative approach. When subscribed, our service retrieves all the product information. But we didn't change the code that retrieves a single product to a declarative approach. We couldn't at the time, because it requires a product id for use in the URL.

Now that our `BehaviorSubject` emits the product id, we can change this code to a declarative approach. Start by declaring a variable, `product$` singular. Set it equal to `this.productSelected$`, and let's add `readonly` to the front to ensure it's not changed.

```diff
# ...
  readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((p) => console.log(JSON.stringify(p))),
    shareReplay(1),
    catchError((err) => this.handleError(err))
  );

+ readonly product$ = this.productSelected$;
```

But wait, this observable emits a product id or undefined, not the product itself. To get the product, we pipe the id through a set of operators and use some type of map to transform the id into an observable. That observable emits the product data. Recall from earlier in this course how we do that? Yep, we use a higher‑order mapping operator. The user could select one product, then quickly select another. We only want the data for the most recent selection, so we'll use a `switchMap`.

`productSelected$` emits the product id into this operator. We want the `switchMap` function to perform two operations, set the appropriate URL and call http.get, so we define a multi‑line arrow function using curly braces. Let's copy this code and paste it here within the curly braces.

```ts
class ProductService {
  readonly productSelected$ = this.productSelectedSubject.asObservable();

  readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((p) => console.log(JSON.stringify(p))),
    shareReplay(1),
    catchError((err) => this.handleError(err))
  );

  /*diff*/
  readonly product$ = this.productSelected$.pipe(
    switchMap((id) => {
      const productUrl = `${this.productsUrl}/${id}`;
      return this.http.get<Product>(productUrl).pipe(
        tap(() => console.log("In http.get by id pipeline")),
        switchMap((p) => this.getProductsWithReviews(p)),
        catchError((err) => this.handleError(err))
      );
    })
  );
  /*diff*/

  getProduct(id: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(productUrl).pipe(
      tap(() => console.log("In http.get by id pipeline")),
      switchMap((p) => this.getProductsWithReviews(p)),
      catchError((err) => this.handleError(err))
    );
  }
}
```

The `productSelected` observable emits the product id. We take that id and use it to construct the appropriate URL. Then we issue an http.get request, passing in that URL. We pipe the result through another set of operators to get the related reviews. Let's delete this tap operator. 

Hovering over `product$`, we see that it is indeed an Observable that emits a Product. Hovering over `productSelected$`, it can emit a number or undefined. 

We don't want to get a product if the id is undefined. Let's use a little trick and filter out any null or undefined values using the filter operator. 

```diff
readonly product$ = this.productSelected$.pipe(
+   filter(Boolean),
    switchMap((id) => {
      const productUrl = `${this.productsUrl}/${id}`;
      return this.http.get<Product>(productUrl).pipe(
-       tap(() => console.log('In http.get by id pipeline')),
        switchMap((p) => this.getProductsWithReviews(p)),
        catchError((err) => this.handleError(err))
      );
    })
  );
```

We leverage the Boolean function technique to check for undefined or null. The Boolean function returns true when an item exists and false when the item is false, undefined or null. 

This code now retrieves a product using the product id emitted from our `BehaviorSubject`. It then answers the question we asked earlier in this course, how do we pass a parameter in when we use the declarative approach? We use a `Subject` or `BehaviorSubject`. We access its readonly observable and react to its emissions. We use the emitted value for the query parameter. 

What if we want more than one parameter? We could create an object with a property for each required parameter and emit that object, or we could combine multiple observables, as we'll see in a bit. Let's throw up a best practices slide. 
