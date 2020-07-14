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
