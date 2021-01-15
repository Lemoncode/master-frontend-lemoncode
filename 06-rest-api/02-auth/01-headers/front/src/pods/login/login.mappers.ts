import * as apiModel from './api/login.api-model';
import * as viewModel from 'common-app/auth/auth.vm';

export const mapUserSessionFromApiToVm = (
  userSession: apiModel.UserSession
): viewModel.UserSession => ({
  userName: `${userSession.firstname} ${userSession.lastname}`,
});
