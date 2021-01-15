import { PropOptions } from "vue";
import { Recipe, RecipeError } from "./viewModel";

export interface FormProps {
  recipe: PropOptions<Recipe>;
  recipeError: PropOptions<RecipeError>;
  onUpdateRecipe: PropOptions<(field: string, value: string) => void>;
  onSave: PropOptions<() => void>;
  onRemoveIngredient: PropOptions<(ingredient: string) => void>;
  onAddIngredient: PropOptions<(ingredient: string) => void>;
}
