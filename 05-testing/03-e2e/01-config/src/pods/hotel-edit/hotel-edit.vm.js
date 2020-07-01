export const createEmptyHotel = () => ({
  id: '0',
  picture: '',
  name: '',
  description: '',
  rating: 3,
  address: '',
  city: '',
});

export const createEmptyHotelErrors = () => ({
  id: {
    succeded: true,
    message: '',
  },
  picture: {
    succeded: true,
    message: '',
  },
  name: {
    succeded: true,
    message: '',
  },
  description: {
    succeded: true,
    message: '',
  },
  rating: {
    succeded: true,
    message: '',
  },
  address: {
    succeded: true,
    message: '',
  },
  city: {
    succeded: true,
    message: '',
  },
});
