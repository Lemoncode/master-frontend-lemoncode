import { House } from './house.models';

export const getHouseTitle = (house: House) => `House ${house.charAt(0).toUpperCase()}${house.slice(1)}`;
