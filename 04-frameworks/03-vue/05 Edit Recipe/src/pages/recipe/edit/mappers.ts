import * as model from '../../../rest-api/model';
import * as vm from './viewModel';

export const mapRecipeModelToVm = (recipe: model.Recipe): vm.Recipe => ({
  ...recipe,
});

export const mapRecipeVmToModel = (recipe: vm.Recipe): model.Recipe => ({
  ...recipe,
});
