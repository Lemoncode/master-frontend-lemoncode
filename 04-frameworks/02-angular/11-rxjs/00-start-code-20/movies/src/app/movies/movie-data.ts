import { Movie } from './movie';

export class MovieData {
  static movies: Movie[] = [
    {
      id: 1,
      movieName: 'Leaf Rake',
      movieCode: 'GDN-0011',
      description: 'Leaf rake with 48-inch wooden handle',
      price: 19.95,
      likes: 15,
      hasReviews: true,
    },
    {
      id: 2,
      movieName: 'Garden Adventure',
      movieCode: 'GDN-0023',
      description: '15 gallon capacity rolling garden cart',
      price: 32.99,
      likes: 2,
      hasReviews: true,
    },
    {
      id: 5,
      movieName: 'Hammer Arena',
      movieCode: 'TBX-0048',
      description: 'Curved claw steel hammer',
      price: 8.9,
      likes: 8,
      hasReviews: true,
    },
    {
      id: 8,
      movieName: 'Saw',
      movieCode: 'TBX-0022',
      description: '15-inch steel blade hand saw',
      price: 11.55,
      likes: 6,
      hasReviews: false,
    },
    {
      id: 10,
      movieName: 'Playing Video Games',
      movieCode: 'GMG-0042',
      description: 'A film about video games',
      price: 35.95,
      likes: 12,
      hasReviews: true,
    },
  ];
}
