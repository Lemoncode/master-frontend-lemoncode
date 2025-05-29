import React from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { useSnackbarContext } from '#common/components';
import { linkRoutes } from '#core/router';

export const useApiConfig = () => {
  const navigate = useNavigate();
  const { showMessage } = useSnackbarContext();

  React.useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response.status === 401) {
          showMessage('You should login', 'error');
          navigate(linkRoutes.login);
        }
      }
    );
  }, []);
};
