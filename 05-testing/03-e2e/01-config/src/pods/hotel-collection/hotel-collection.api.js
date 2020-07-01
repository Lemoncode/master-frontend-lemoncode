import Axios from 'axios';

const url = `${process.env.BASE_API_URL}/api/hotels`;

export const fetchHotelCollection = () =>
  Axios.get(url).then(({ data }) => data);
