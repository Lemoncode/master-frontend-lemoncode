import type { User } from './model';

export const getUsers = async (name: string): Promise<User[]> => {
	return fetch(`https://jsonplaceholder.typicode.com/users?name_like=${name}`)
		.then((res) => res.json())
		.then((data) => data);
};
