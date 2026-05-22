// This is just an in-memory store for demonstration purposes.
// Ideally we could connect to a database or an external API.
const likeStore: Map<string, number> = new Map();

export const getLikes = async (slug: string): Promise<number> => {
  return likeStore.get(slug) ?? 0;
};

export const addLike = async (slug: string): Promise<number> => {
  const current = likeStore.get(slug) ?? 0;
  const updated = current + 1;
  likeStore.set(slug, updated);
  return updated;
};
