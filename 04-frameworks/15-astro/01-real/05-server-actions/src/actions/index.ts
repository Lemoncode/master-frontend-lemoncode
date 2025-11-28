import { defineAction } from 'astro:actions';
import { addLike, getLikes } from './repository';
import type { LikesResponse } from './model';

export const server = {
  addLike: defineAction<LikesResponse>({
    async handler(slug) {
      return { likes: await addLike(slug) };
    },
  }),
  getLikes: defineAction<LikesResponse>({
    async handler(slug) {
      return { likes: await getLikes(slug) };
    },
  }),
};
