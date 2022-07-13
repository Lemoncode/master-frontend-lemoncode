export class User {

  constructor(
    public id: number,
    public name: string,
    public first_name?: string,
    public last_name?: string,
    public avatar?: string,
    public age?: number
  ) { }
}

export interface TypicodeUser {
    "id": string;
    "name": string;
    "username": string;
    "email": string;
    "address": {
      "street": string;
      "suite": string;
      "city": string;
      "zipcode": string;
      "geo": {
        "lat": number;
        "lng": number;
      }
    };
    "phone": string;
    "website": string;
    "company": {
      "name": string;
      "catchPhrase": string;
      "bs": string;
    }
}
