import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewUrl = 'api/reviews';

  getReviewUrl(movieId: number): string {
    return `${this.reviewUrl}?movieId=^${movieId}$`;
  }
}
