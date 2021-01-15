import { UserSession, createEmptyUserSession } from 'common-app/auth';

export const mapLoginResponseToUserSession = (): UserSession =>
  createEmptyUserSession();
