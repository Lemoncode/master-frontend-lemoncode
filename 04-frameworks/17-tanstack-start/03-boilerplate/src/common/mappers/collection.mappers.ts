export const mapToCollection = <A, B>(
  collection: A[],
  mapItemFn: (item: A, index: number) => B
): B[] => (Array.isArray(collection) ? collection.map(mapItemFn) : []);
