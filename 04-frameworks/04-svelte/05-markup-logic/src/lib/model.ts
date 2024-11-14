export interface User {
	id: string;
	name: string;
	email: string;
}

export const createUserList = () => [
	{
		id: '1',
		name: 'John Doe',
		email: 'john-doe@email.com'
	},
	{
		id: '2',
		name: 'Jane Doe',
		email: 'jane-doe@email.com'
	},
	{
		id: '3',
		name: 'Alice',
		email: 'alice@email.com'
	}
];
