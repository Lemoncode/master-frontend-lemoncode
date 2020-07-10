import Router, { RouteConfig } from 'vue-router';
import { LoginPageContainer } from './pages/login';
import { RecipeListPageContainer } from './pages/recipe/list';
import { EditRecipePage } from './pages/recipe/edit';

const routes: RouteConfig[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPageContainer },
  { path: '/recipe', component: RecipeListPageContainer },
  { path: '/recipe/:id', component: EditRecipePage, props: true },
];

export const router = new Router({
  routes,
});
