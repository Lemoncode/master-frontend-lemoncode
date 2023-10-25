import React from 'react';
import { AuthContextModel } from './auth.model';

export const AuthContext = React.createContext<AuthContextModel>(null);

export const useAuthContext = () => React.useContext(AuthContext);