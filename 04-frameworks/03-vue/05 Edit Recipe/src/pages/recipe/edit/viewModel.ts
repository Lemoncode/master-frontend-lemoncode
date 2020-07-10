import { FieldValidationResult } from 'lc-form-validation';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
}

export const createEmptyRecipe = (): Recipe => ({
  id: 0,
  name: '',
  description: '',
  ingredients: [],
});

export interface RecipeError {
  name: FieldValidationResult;
  ingredients: FieldValidationResult;
}

export const createEmptyRecipeError = (): RecipeError => ({
  name: {
    key: 'name',
    succeeded: true,
    errorMessage: '',
    type: '',
  },
  ingredients: {
    key: 'ingredients',
    succeeded: true,
    errorMessage: '',
    type: '',
  },
});
