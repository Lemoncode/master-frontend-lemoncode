import Axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/users?name_like=';

export const getUsersByFilter = filter =>
  Axios.get(`${url}${filter}`).then(({ data }) => data);
