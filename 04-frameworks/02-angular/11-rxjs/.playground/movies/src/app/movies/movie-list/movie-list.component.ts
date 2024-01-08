import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, 
  inject 
} from '@angular/core';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { MovieService } from '../movie.service';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, MovieDetailComponent, AsyncPipe],
  templateUrl: './movie-list.component.html',
  styles: ``,
})
export class MovieListComponent {
  pageTitle = 'Movies';
  errorMessage = '';
  
  private movieService = inject(MovieService);
  readonly movies$ = this.movieService.movies$.pipe(
    // tap(() => console.log('In component pipeline')),
        catchError((err) => {
          this.errorMessage = err;
          return EMPTY;
        })
  );

  selectedMovieId: number = 0;

  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
  }
}
