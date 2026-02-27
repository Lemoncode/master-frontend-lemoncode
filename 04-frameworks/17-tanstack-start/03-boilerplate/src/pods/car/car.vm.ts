export interface Car {
  id: string;
  name: string;
  imageUrl: string;
  features: string[];
  isBooked: boolean;
}

export const createEmptyCar = (): Car => ({
  id: '',
  name: '',
  imageUrl: '',
  features: [],
  isBooked: false,
});
