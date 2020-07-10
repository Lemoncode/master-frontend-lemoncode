import { PropOptions } from 'vue';
import { Login, LoginError } from './viewModel';

export interface FormProps {
  login: PropOptions<Login>;
  loginError: PropOptions<LoginError>;
  updateLogin: PropOptions<(name: string, password: string) => void>;
  loginRequest: PropOptions<() => void>;
}
