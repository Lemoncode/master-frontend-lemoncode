import { InMemoryDbService } from 'angular-in-memory-web-api';

import { MovieData } from './movies/movie-data';
import { ReviewData } from './reviews/review-data';
import { Movie } from './movies/movie';
import { Review } from './reviews/review';

export class AppData implements InMemoryDbService {
  createDb(): { movies: Movie[]; reviews: Review[] } {
    const movies = MovieData.movies;
    const reviews = ReviewData.reviews;
    return { movies, reviews };
  }
}
