import { z } from "zod";

export const episodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  episode: z.string(),
  airDate: z.string(),
});

export const characterDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["Alive", "Dead", "unknown"]),
  species: z.string(),
  gender: z.string(),
  image: z.url(),
  origin: z.string(),
  location: z.string(),
  episodeCount: z.number(),
  episodes: z.array(episodeSchema),
});

export type EpisodeApiModel = z.infer<typeof episodeSchema>;
export type CharacterDetailApiModel = z.infer<typeof characterDetailSchema>;
