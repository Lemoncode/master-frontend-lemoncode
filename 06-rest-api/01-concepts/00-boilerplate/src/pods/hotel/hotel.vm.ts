export interface Hotel {
  id: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  city: string;
}

export const createEmptyHotel = (): Hotel => ({
  id: '',
  name: '',
  description: '',
  rating: 3,
  address: '',
  city: '',
});
