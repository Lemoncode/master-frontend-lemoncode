import { User } from '../user.model';

export interface ProfileRepositoryContract {
  userProfileExists: (googleProfileId: string) => Promise<boolean>;
  addNewUser: (user: User) => Promise<User>;
  getUser: (id: number) => Promise<User>;
  getUserByGoogleId: (id: string) => Promise<User>;
}
