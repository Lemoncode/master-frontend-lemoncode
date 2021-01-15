export const mapToCollection = <A, B>(
  collection: A[],
  mapItemFn: (item: A) => B
): B[] => (Array.isArray(collection) ? collection.map(mapItemFn) : []);
