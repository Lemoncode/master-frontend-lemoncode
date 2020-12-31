import { Component, OnInit } from '@angular/core';
import { interval, Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-observables',
  templateUrl: './observables.component.html',
  styleUrls: ['./observables.component.scss']
})
export class ObservablesComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // const Obs1$: Observable<string> = new Observable( (observer: Observer<string>) => {
    //   observer.next('Hello');
    //   observer.next('World');
    //   observer.complete();
    // });

    // const Obs1$ = from(['Hello', 'World']);

    // Obs1$.subscribe({
    //   next: (x:string) => { console.log('Emisión:', x) },
    //   error: (e: string) => { console.log('Error:', e); },
    //   complete: () => { console.log('Fin'); }
    // });

    // Creación de observable "infinito"
    // const Obs2$ = new Observable((observer: Observer<number>) => {
    //   let value = 0;
    //   const interval = setInterval(() => {
    //     if (value % 2 === 0) {
    //       observer.next(value);
    //     }
    //     value++;
    //   }, 1000);

    //   return () => {
    //     clearInterval(interval);
    //     console.log('Me he quedado sin observador');
    //    }
    // });
    
    // const Obs2$ = interval(1000).pipe( filter( x => x % 2 === 0) )

    // const subs2 = Obs2$.subscribe(x => console.log('subs2:',x));

    // Nos des-suscribimos a los 10 segundos
    // setTimeout(() => {
    //   subs2.unsubscribe();
    // }, 10000);

    // setTimeout(() => {
    //   Obs2$.subscribe(x => console.log('subs3:',x));
    // }, 5000);

    // Son Observables fríos:
    // - Una instancia por cada subscripción
    // - El observable empieza en el momento de la subscripción
    // - Desuscribirse del observable para liberar memoria


    // Introducción a los operadores
    // Obs1$.pipe(
    //   map( (x:string) => x.toUpperCase() )
    // )
    // .subscribe({
    //   next: (x:string) => { console.log('Emisión:', x) },
    //   error: (e: string) => { console.log('Error:', e); },
    //   complete: () => { console.log('Fin'); }
    // });

    // Obs1$.pipe(
    //   map( (x:string) => x.toUpperCase() ),
    //   map( (x:string) => x.split("").reverse().join("") )
    // )
    // .subscribe({
    //   next: (x:string) => { console.log('Emisión:', x) },
    //   error: (e: string) => { console.log('Error:', e); },
    //   complete: () => { console.log('Fin'); }
    // });

  }

}
