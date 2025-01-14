export interface Lookup {
  id: string;
  name: string;
}

export const createEmptyLookup = (): Lookup => ({
  id: '',
  name: '',
});
