import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';

export const routes: Routes = [
  { path: 'welcome', component: HomeComponent },
  {
    path: 'movies',
    loadComponent: () =>
      import('./movies/movie-list/movie-list.component').then((m) => m.MovieListComponent),
  },
];
