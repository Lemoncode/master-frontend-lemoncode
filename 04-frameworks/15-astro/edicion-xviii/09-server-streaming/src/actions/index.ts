import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { addLike } from "../server/likes";
import { getLikes } from "../server/likes";
import type { LikesResponse } from "./model";

export const server = {
  addLike: defineAction<LikesResponse>({
    async handler() {
      return { likes: addLike() };
    },
  }),
  getLikes: defineAction<LikesResponse>({
    async handler() {
      return { likes: getLikes() };
    },
  }),
};
