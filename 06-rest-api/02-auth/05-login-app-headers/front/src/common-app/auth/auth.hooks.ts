import { useNavigate } from 'react-router-dom';
import { useSnackbarContext } from 'common/components';
import { linkRoutes } from 'core/router';
import { AxiosError } from 'axios';

type Request = (...params: any[]) => Promise<any>;

export const useAuthRequest = <T extends Request[]>(...requestList: T): T => {
  const navigate = useNavigate();
  const { showMessage } = useSnackbarContext();

  const authRequestList = requestList.map((request) => async (...params) => {
    try {
      return await request(...params);
    } catch (errorResponse) {
      if (isAuthError(errorResponse)) {
        navigate(linkRoutes.login);
        showMessage('You should login', 'error');
        throw undefined;
      }
      throw errorResponse;
    }
  }) as T;

  return authRequestList;
};

const isAuthError = (error: AxiosError): boolean => {
  const errorCode = error.response.status;

  return errorCode === 401;
};
