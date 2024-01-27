# High Order Operators

## HOO: `concatMap`


Let's try it out. In this demo, we try out the `concatMap` higher‑order mapping operator.  

For this example, we'll emit a set of numbers. We use a higher‑order mapping operator to transform each of those numbers into a new observable. 

Update `src/app/app.component.ts`

Let's set a random delay between the emissions so we can better see the difference between the higher‑order mapping operators. A random delay better emulates the real world, where an HTTP request response always has some undetermined amount of delay. Start by creating a method that provides a random delay amount. I'll paste the code. It uses Math.random to create a random number that is greater than or equal to 0 and less than 1. It multiplies that number by 1000 to get a number greater than or equal to 0 and less than 1000. It then uses Math.floor to round down. Lastly, we add 500 to the result, giving us a random number between 500 and 1499 milliseconds. 


Since we're just trying out these features, I'll ignore managing the subscriptions to save some typing. 

Next, we implement OnInit, add the needed import, and create the ngOnInit method. That gives us somewhere to write our code. 

Let's use the `range` RxJS creation function. As its name suggests, the range emits integers in a given range of values. We'll pass in the starting number and the count. We'll start at 1 and emit 5 numbers. 

Next we pipe the emitted value through a set of operators. We'll use the `concatMap` operator. The source observable emits a number I'll represent with i. The higher‑order mapping operators expect to return an observable, so we use the of creation function and return of i and add the needed import. 

```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { concatMap, of, range } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  ngOnInit(): void {
    range(1, 5).pipe(
      concatMap((i) => of(i))
    )
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}

```

With this code, the `concatMap` takes in a number and transforms it to an observable that emits that number, and this is where our `randomDelay` comes in. We don't want the observable to emit right away to emulate an HTTP request and response. We'll delay emission of the result. 

To do that, we pipe the emission and use the delay RxJS operator. The delay operator takes in the amount of delay in milliseconds. We'll call our randomDelay method to specify a random amount of delay and add the needed import. Don't forget to subscribe, and for the next callback function, we'll log a description and the emitted value. 

```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { concatMap, delay, of, range } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  ngOnInit(): void {
    range(1, 5)
      .pipe(
        concatMap((i) => of(i).pipe(
          delay(this.randomDelay())
        ))
      )
      .subscribe((item) => console.log('concatMap:', item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}

```

```bash
npm start
```

Open in browser, using dev tools.

Notice that we see the numbers 1 through 5 emitted in sequence. If you refresh again, notice the pause between the emissions, and you'll see that they always appear in that sequence. That's because the `concatMap` always waits for each inner observable to complete before processing the next one so they are always in order. 

Before we move on, let's think about this for a moment. Maybe we have a product compare feature in our application. The user picks three products and we use the selected ids to get those products. Would we want to retrieve one, wait for the response to return, then go get the next one, wait for its response to return, and finally go get the last one? That's not very efficient. Keep this in mind as you select the appropriate higher‑order mapping operator for your scenario. Now let's see how `mergeMap` is different.

## HOO: mergeMap

In this demo, we try out the `mergeMap` higher‑order mapping operator.

Update `src/app/app.component.ts`

Let's copy the code we created for the `concatMap` example and paste it below. Change the `range` to start at 11 and emit 5 items. That way when we see the emissions from both of our streams, we'll easily see which values came from where.

Since we are trying out `mergeMap`, we'll change `concatMap` to `mergeMap` here, add the import, and change the log message here. And let's comment out the `concatMap` example for a moment to simplify our output.

```ts
export class AppComponent implements OnInit {
  pageTitle = "Lemoncode Store";
  cartCount = 0;

  ngOnInit(): void {
    // range(1, 5)
    //   .pipe(concatMap((i) => of(i).pipe(delay(this.randomDelay()))))
    //   .subscribe((item) => console.log('concatMap:', item));

    range(11, 5)
      .pipe(mergeMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log("mergeMap:", item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
```

```bash
npm start
```

Open the browser's console, and we see the emitted items. Notice that they aren't in any particular order. Since we have a `randomDelay`, the items may emit at any time.

Click Refresh and notice how quickly they are emitted, and each time we refresh, we may see a different order.

The `mergeMap` emits all of its values as soon as it can and merges them to the output observable.

Before we move on, let's think about this for a moment. Think back to our product compare feature. The user picks three products and we use the selected ids to get those products. With `mergeMap`, all three retrieves happen concurrently and the responses return as soon as they can, so we get all the data more quickly using `mergeMap`.

To see that in action, let's uncomment the `concatMap`, look at the console, and Refresh.

```ts
export class AppComponent implements OnInit {
  pageTitle = "Lemoncode Store";
  cartCount = 0;

  ngOnInit(): void {
    range(1, 5)
      .pipe(concatMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log("concatMap:", item));

    range(11, 5)
      .pipe(mergeMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log("mergeMap:", item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
```

Several mergeMaps are emitted, then our first `concatMap`, then the rest of our mergeMaps, and lastly, the remaining concatMaps finish.

Click refresh to see it again. Each time the mergeMaps are completed well before the concatMaps finish, and often before the second concatMap emits. Keep this in mind as you select the appropriate higher‑order mapping operator for your scenario. Now let's check out switchMap.

## HOO: switchMap

In this demo, we switch to the `switchMap` higher‑order mapping operator.

Update `LCS/src/app/app.component.ts`

Let's again copy the code we created for the concatMap example and paste it below. Change the range this time to start at 21 and emit 5 items. That way we'll easily see which values in the console came from where. Since we are trying out `switchMap`, we'll change `concatMap` to `switchMap` here and in the log message here, and don't forget to add the import. Let's comment out both of the prior subscriptions for a moment to simplify our output.

```ts
export class AppComponent implements OnInit {
  pageTitle = "Lemoncode Store";
  cartCount = 0;

  ngOnInit(): void {
    // range(1, 5)
    //   .pipe(concatMap((i) => of(i).pipe(delay(this.randomDelay()))))
    //   .subscribe((item) => console.log('concatMap:', item));

    // range(11, 5)
    //   .pipe(mergeMap((i) => of(i).pipe(delay(this.randomDelay()))))
    //   .subscribe((item) => console.log('mergeMap:', item));

    range(21, 5)
      .pipe(switchMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log("switchMap:", item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
```

```bash
npm start
```

Open the browser's console. There's only one item emitted. It's 25. Let's try refreshing. Yep, there's only one item. 

What's happening? When the 21 is emitted, we create an observable. As soon as the 22 is emitted, the `switchMap` unsubscribes from that first observable, canceling it. The `switchMap` then creates a new observable. Then when the 23 is emitted, it again unsubscribes from the prior observable and creates a new observable, and so on. When the 25 is emitted, it unsubscribes from the 24's observable and creates a new observable, and since there are no other emissions after the 25, 25's observable is not unsubscribed. Its value is emitted and displayed in the console. 

Let's think about this for a moment. For our product list feature, let's say we use switchMap to retrieve both the product and its reviews. The user picks a product. If the user quickly realizes that they picked the wrong product and picks again, the HTTP requests are canceled and data for the new selection is retrieved, so we can quickly cancel prior requests using `switchMap`. Let's see all our higher‑order operators in action. I'll uncomment the code, then Refresh. 

```ts
export class AppComponent implements OnInit {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  ngOnInit(): void {
    range(1, 5)
      .pipe(concatMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log('concatMap:', item));

    range(11, 5)
      .pipe(mergeMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log('mergeMap:', item));

    range(21, 5)
      .pipe(switchMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log('switchMap:', item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
```

Look at the console. Several mergeMaps emitted, then our first concatMap, then the rest of our mergeMaps, our one switchMap, and lastly, the remaining concatMaps finish. Click Refresh to see it again. Depending on the randomDelay, the switchMap may appear anywhere earlier or later, but it always only emits its last value. Keep these differences in mind as you select the appropriate higher‑order mapping operator for your scenario. Now let's apply what we learned to our sample application and get those product reviews.
