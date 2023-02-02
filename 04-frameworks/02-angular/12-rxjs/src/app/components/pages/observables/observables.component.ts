import { Component, OnInit } from '@angular/core';
import { from, interval, Observable, Observer, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-observables',
  templateUrl: './observables.component.html',
  styleUrls: ['./observables.component.scss']
})
export class ObservablesComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // const obs1$: Observable<string> = new Observable( (observer: Observer<string>) => {
    //   observer.next('Hello');
    //   observer.next('World');
    //   observer.complete();
    // });

    // const obs1$ = from(['Hello', 'World']);
    // const obs1$ = of(['Hello', 'World']);

    // obs1$.subscribe({
    //   next: (x:any) => { console.log('Emisión:', x) },
    //   error: (e: string) => { console.log('Error:', e); },
    //   complete: () => { console.log('Fin'); }
    // });

    // Creación de observable "infinito"
    // const obs2$ = new Observable((observer: Observer<number>) => {
    //   let value = 0;
    //   const intervalId = setInterval(() => {
    //     if (value % 2 === 0) {
    //       observer.next(value);
    //       //console.log('next');
    //     }
    //     value++;
    //   }, 1000);

    //   return () => {
    //     clearInterval(intervalId);
    //     console.log('Me he quedado sin observador');
    //    }
    // });
    
    // const obs2$ = interval(1000).pipe( filter( x => x % 2 === 0) )

    // const subs2 = obs2$.subscribe(x => console.log('subs2:',x));

    // Nos des-suscribimos a los 10 segundos
    // setTimeout(() => {
    //   subs2.unsubscribe();
    // }, 10000);

    // setTimeout(() => {
    //   obs2$.subscribe(x => console.log('subs3:',x));
    // }, 5000);

    // Son Observables fríos:
    // - Una instancia por cada subscripción
    // - El observable empieza en el momento de la subscripción
    // - Desuscribirse del observable para liberar memoria


    // // Introducción a los operadores
    // obs1$.pipe(
    //   map( (x:string) => x.toUpperCase() )
    // )
    // .subscribe({
    //   next: (x:string) => { console.log('Emisión:', x) },
    //   error: (e: string) => { console.log('Error:', e); },
    //   complete: () => { console.log('Fin'); }
    // });

    // obs1$.pipe(
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
