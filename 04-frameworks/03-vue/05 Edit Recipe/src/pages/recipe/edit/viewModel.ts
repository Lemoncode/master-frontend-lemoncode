import {
  ValidationResult,
  createDefaultValidationResult,
} from "@lemoncode/fonk";

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
}

export const createEmptyRecipe = (): Recipe => ({
  id: 0,
  name: "",
  description: "",
  ingredients: [],
});

export interface RecipeError {
  name: ValidationResult;
  ingredients: ValidationResult;
}

export const createEmptyRecipeError = (): RecipeError => ({
  name: createDefaultValidationResult(),
  ingredients: createDefaultValidationResult(),
});
