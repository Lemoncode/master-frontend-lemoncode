export interface Routes {
  root: string;
  carList: string;
  car: (cardId: string) => string;
}

export const routeConstants: Routes = {
  root: '/',
  carList: '/cars',
  car: (cardId: string) => `/cars/${cardId}`,
};
