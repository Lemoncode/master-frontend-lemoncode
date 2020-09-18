export interface Item {
  id: string;
  name: string;
}

export const createEmptyItemList = (): Item[] => [
  {
    id: '',
    name: 'No data',
  },
];

export const createNoTokenItemList = (): Item[] => [
  {
    id: '',
    name: 'Fail to process request: No Token',
  },
];
