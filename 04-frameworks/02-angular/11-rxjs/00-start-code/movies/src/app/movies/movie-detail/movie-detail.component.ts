import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movie } from '../movie';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  templateUrl: './movie-detail.component.html',
  styles: ``
})
export class MovieDetailComponent {
  // Just enough here for the template to compile
  @Input() movieId: number = 0;
  errorMessage = '';

  // Movie to display
  movie: Movie | null = null;

  // Set the page title
  pageTitle = this.movie ? `Product Detail for: ${this.movie.movieName}` : 'Movie Detail';

  addToCart(movie: Movie) {
  }
}
