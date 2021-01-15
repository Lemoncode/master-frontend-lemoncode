import * as model from '../../../rest-api/model';
import * as vm from './viewModel';

export const mapRecipeListModelToVm = (recipes: model.Recipe[]): vm.Recipe[] =>
  recipes.map(mapRecipeModelToVm);

const mapRecipeModelToVm = (recipe: model.Recipe): vm.Recipe => ({
  ...recipe,
});
