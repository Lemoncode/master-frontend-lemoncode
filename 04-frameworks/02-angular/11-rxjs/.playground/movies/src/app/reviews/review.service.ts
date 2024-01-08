import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsUrl = 'api/reviews';

  getReviewUrl(movieId: number): string {
    return `${this.reviewsUrl}?movieId=^${movieId}$`;
  }
}
