import { Recipe } from '../../model';
import { mockRecipes } from './mockData';

export const fetchRecipes = (): Promise<Recipe[]> => {
  return Promise.resolve(mockRecipes);
};
