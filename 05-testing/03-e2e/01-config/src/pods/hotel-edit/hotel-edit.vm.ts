export interface Hotel {
  id: string;
  picture: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  city: string;
}

export const createEmptyHotel = (): Hotel => ({
  id: '',
  picture: '',
  name: '',
  description: '',
  rating: 3,
  address: '',
  city: '',
});
