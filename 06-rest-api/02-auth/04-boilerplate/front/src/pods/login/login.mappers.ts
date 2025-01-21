import * as apiModel from './api/login.api-model';
import * as viewModel from '#core/auth/auth.vm';

export const mapUserSessionFromApiToVm = (
  userSession: apiModel.UserSession
): viewModel.UserSession => ({
  userName: `${userSession.firstname} ${userSession.lastname}`,
});
