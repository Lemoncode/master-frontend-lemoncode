export interface Routes {
  root: string;
  car: (cardId: string) => string;
}

export const routeConstants: Routes = {
  root: '/',
  car: (cardId: string) => `/cars/${cardId}`,
};
