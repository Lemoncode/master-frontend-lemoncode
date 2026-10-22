import { Review } from '../reviews/review';

/* Defines the product entity */
export interface Movie {
  id: number;
  movieName: string;
  movieCode: string;
  description: string;
  price: number;
  likes?: number;
  hasReviews?: boolean;
  reviews?: Review[];
}
