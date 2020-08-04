import * as model from '../../rest-api/model';
import * as vm from './viewModel';

export const mapLoginVmToModel = (login: vm.Login): model.Login => ({
  ...login,
});
