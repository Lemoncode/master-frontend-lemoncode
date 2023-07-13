export const mapCollection = <Item, MappedItem>(
  collection: Item[],
  mapFn: (item: Item) => MappedItem
): MappedItem[] => (Array.isArray(collection) ? collection.map(mapFn) : []);
