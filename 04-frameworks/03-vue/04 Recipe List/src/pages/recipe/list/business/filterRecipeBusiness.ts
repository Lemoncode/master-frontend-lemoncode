import { Recipe } from '../viewModel';

export const filterRecipesByCommaSeparatedText = (recipes, searchText) => {
  const searchedIngredients = getSearchedIngredientList(searchText);

  return searchText === ''
    ? recipes
    : filterRecipesBySearchedIngredients(recipes, searchedIngredients);
};

const getSearchedIngredientList = (searchText: string) => {
  return searchText.split(',');
};

const filterRecipesBySearchedIngredients = (recipes, searchedIngredients) => {
  return recipes.filter((recipe: Recipe) =>
    matchAllSearchedIngredients(recipe.ingredients, searchedIngredients)
  );
};

const matchAllSearchedIngredients = (ingredients, searchedIngredients) => {
  return searchedIngredients.every(searchedIngredient =>
    matchSearchedIngredient(searchedIngredient, ingredients)
  );
};

const matchSearchedIngredient = (
  searchedIngredient: string,
  ingredients: string[]
) => {
  return ingredients.some(ingredient =>
    matchIngredient(ingredient, searchedIngredient)
  );
};

const matchIngredient = (ingredient, searchedIngredient) => {
  const searchedIngredientLowerCase = searchedIngredient.toLowerCase().trim();
  const ingredientLowerCase = ingredient.toLowerCase().trim();

  return ingredientLowerCase.indexOf(searchedIngredientLowerCase) >= 0;
};
