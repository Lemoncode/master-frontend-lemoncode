export const mapCollection = (collection, mapFn) =>
  Array.isArray(collection) ? collection.map(mapFn) : [];
