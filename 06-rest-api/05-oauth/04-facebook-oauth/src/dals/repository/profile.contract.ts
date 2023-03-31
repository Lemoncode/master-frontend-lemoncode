import { User } from '../user.model';

export interface ProfileRepositoryContract {
  userProfileExists: (providerId: string) => Promise<boolean>;
  addNewUser: (user: User) => Promise<User>;
  getUser: (id: number) => Promise<User>;
  getUserByGoogleId: (id: string) => Promise<User>;
  getUserByFacebookId: (id: string) => Promise<User>;
}
