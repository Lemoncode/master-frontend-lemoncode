import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-observables',
  templateUrl: './observables.component.html',
  styleUrls: ['./observables.component.scss']
})
export class ObservablesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // // Creación de observable básico
    // const Obs1$ = new Observable( emmiter => {
    //   emmiter.next('Hello');
    //   emmiter.next('World');
    //   emmiter.complete();
    // });

    // Obs1$.subscribe(
    //   x => { console.log('Emisión:', x); },
    //   e => { console.log('Error:', e); },
    //   () => { console.log('Fin'); }
    // );

    // // Creación de observable "infinito"
    // const Obs2$ = new Observable( emmiter => {
    //   let value = 0;
    //   const interval = setInterval(() => {
    //     if (value % 2 === 0) {
    //       emmiter.next(value);
    //     }
    //     value++;
    //   }, 1000);

    //   return () => {
    //      clearInterval(interval);
    //      console.log('Me he quedado sin observador');
    //    };
    //  });

    // const subs2 = Obs2$.subscribe(
    //   x => console.log('subs2:', x)
    // );

    // // Nos desuscribimos después de 10 segundos
    // setTimeout(() => {
    //   subs2.unsubscribe();
    // }, 10000);

    // // Se suscribe un segundo observable a los 5 segundos
    // setTimeout(() => {
    //   const subs3 = Obs2$.subscribe(x => console.log('subs3:', x));
    // }, 5000);

    // // Son Observables fríos:
    // // - Una instancia por cada subscripción
    // // - El observable empieza en el momento de la subscripción
    // // - Desuscribirse del observable para liberar memoria

    // // Introducción a los operadores
    // Obs1$.pipe(
    //   map((x: string) => x.toUpperCase())
    // )
    // .subscribe(
    //   x => { console.log('Emisión:', x); },
    //   e => { console.log('Error:', e); },
    //   () => { console.log('Fin'); }
    // );

    // Obs1$.pipe(
    //   map((x: string) => x.toUpperCase()),
    //   map((x: string) => x.split('').reverse().join(''))
    //  )
    // .subscribe(
    //   function(x) { console.log('Emisión:', x); },
    //   function(e) { console.log('Error:', e); },
    //   function() { console.log('Fin'); }
    // );

  }

}
