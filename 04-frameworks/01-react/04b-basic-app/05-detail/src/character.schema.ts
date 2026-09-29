import z from "zod";

const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["Alive", "Dead", "unknown"]),
  species: z.string(),
  image: z.url(),
  origin: z.string(),
  location: z.string(),
  episodeCount: z.number(),
});

export const episodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  episode: z.string(),
  airDate: z.string(),
});

export const characterDetailSchema = characterSchema.extend({
  gender: z.string(),
  episodes: z.array(episodeSchema),
});

export type Character = z.infer<typeof characterSchema>;
export type Episode = z.infer<typeof episodeSchema>;
export type CharacterDetail = z.infer<typeof characterDetailSchema>;
