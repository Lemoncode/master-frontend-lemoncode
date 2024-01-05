import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import { Movie } from '../movie';
import { Subscription } from 'rxjs';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  templateUrl: './movie-detail.component.html',
  styles: ``
})
export class MovieDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input() movieId: number = 0;
  errorMessage = '';
  /*diff*/
  sub!: Subscription;
  /*diff*/

  // Movie to display
  movie: Movie | null = null;

  // Set the page title
  pageTitle = this.movie ? `Movie Detail for: ${this.movie.movieName}` : 'Movie Detail';

  /*diff*/
  private movieService = inject(MovieService);
  /*diff*/

  /*diff*/
  ngOnChanges(changes: SimpleChanges): void {
    const id = changes["movieId"].currentValue;
    if (id > 0) {
      this.sub = this.movieService
        .getProduct(id)
        .subscribe((movie) => (this.movie = movie));
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  /*diff*/
  addToCart(movie: Movie) {
  }
}
