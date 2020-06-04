export class User {
  constructor(
    public username: string,
    public email: string,
    public id: string,
    public token: string,
  ) {}

}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
}
