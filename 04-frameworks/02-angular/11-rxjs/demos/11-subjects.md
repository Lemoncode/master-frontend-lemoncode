# Subject

In this demo, we create a `Subject` and call its next method to emit a notification with a value. We are back in VS Code with the apm project open, looking at the `product.service`. Let's create a Subject that provides a notification whenever the user selects a new product. 

We want to share the notification with any of our product components and we don't want to lose any emissions, so let's add a `BehaviorSubject` to the `product.service`. 

Update `LCS/src/app/products/product.service.ts`

```diff
import {
+ BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
# .....

export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

+ productSelectedSubject = new BehaviorSubject<number>(undefined);
```

Here, by the declarations, we'll declare a variable for our `BehaviorSubject`. Let's call it `productSelectedSubject`. We set it equal to a new BehaviorSubject. Next we decide what data to pass when our `BehaviorSubject` emits a next notification. Let's pass the id of the selected product. In our example, the id is a number, so we'll set the generic parameter to number. 

`BehaviorSubject` requires an initial value, so what makes sense for an initial value in this case? If the user has not yet selected a product, there is no selected product. We could pass in 0 to indicate no product since 0 isn't a valid productId, but that gives the 0 some special magical meaning. Let's instead use `undefined`. That makes sense, because until the user selects a product, the selected product is in fact undefined. 

We're **seeing an error** here. That's because we defined the type of emissions to be a number. We'll change that to number or undefined. That's better. 

```diff
-productSelectedSubject = new BehaviorSubject<number>(undefined);
+productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
```

Now we have a `BehaviorSubject` that emits an initial value to any new subscribers. We want to ensure that no code in the application accesses this BehaviorSubject except code within this service, so we'll add the `private` keyword at the front. 

```diff
-productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
+private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
```

But any code in the application should be able to subscribe to the underlying observable, so let's expose that observable as a public property. We'll call it `productSelected$`. We use the dollar sign to indicate that it is indeed an observable, and we set it equal to this.`ProductSelectedSubject.asObservable`. To ensure we don't accidentally overwrite this value, let's add readonly as part of the declaration. Done. 

```diff
private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
+readonly productSelected$ = this.productSelectedSubject.asObservable();
```

We now have a `BehaviorSubject` that emits numeric values or undefined to any subscribers, and we have the readonly observable from that Subject that our components and other services can use to subscribe. Every time the user selects a product, we'll use this `BehaviorSubject` and emit a notification with the `productId`. We'll do that in a method. 

Scrolling down, let's add that method. We'll call it `productSelected`. It takes in the `selectedProductId`, which is a number, and returns void. 

Our product‑list.component can call this method when it sees that the user selected a new product. 

Inside the method, we call `this.productSelectedSubject.next`, and emit the `selectedProductId`. We now have a method that emits a next notification with the `selectedProductId`. Cool. 

```diff
# .....
  private getProductsWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(
          map(
            (reviews) =>
              ({
                ...product,
                reviews,
              } as Product)
          )
        );
    }
    return of(product);
  }
+
+ productSelected(selectedProductId: number): void {
+   this.productSelectedSubject.next(selectedProductId);
+ }
}
```

Now let's call this method from somewhere. 

Open `LCS/src/app/products/product-list/product-list.component.html`

Looking at the product‑list template, the HTML displays the set of products. When a user clicks on a product, event binding calls `onSelected` in the component and passes in the id of the selected product. In the `product‑list.component`, we have that method. 

Update `LCS/src/app/products/product-list/product-list.component.ts`

```diff
  onSelected(productId: number): void {
    this.selectedProductId = productId;
+   this.productService.productSelected(productId);
  }
```


Instead of setting a local variable, let's call our new service method. That way the `BehaviorSubject` will emit this product id to any component that subscribes, this.`productService.productSelected`, and we pass in the `productId`. 

Going back to our service, every time the user selects a product, we emit a next notification from that Subject to any subscribers. But we don't yet have any subscribers, and once we do, how do they react to this emission? We'll look at that, next.

