import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { 
  Component, 
  inject } from '@angular/core';
import { Movie } from '../movie';
import { 
  EMPTY, 
  catchError 
} from 'rxjs';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe],
  templateUrl: './movie-detail.component.html',
  styles: ``
})
export class MovieDetailComponent {
  errorMessage = '';
  pageTitle = 'Movie Detail';

  private movieService = inject(MovieService);
  movie$ = this.movieService.movie$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );
  
  addToCart(movie: Movie) {
  }
}
