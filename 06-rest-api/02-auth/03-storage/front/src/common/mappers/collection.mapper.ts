export const mapToCollection = <A, B>(collection: A[], mapFn: (A) => B): B[] =>
  Array.isArray(collection) ? collection.map(mapFn) : [];
