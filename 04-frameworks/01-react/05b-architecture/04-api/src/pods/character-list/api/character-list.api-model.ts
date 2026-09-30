import { z } from "zod";

export const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["Alive", "Dead", "unknown"]),
  species: z.string(),
  gender: z.string(),
  image: z.url(),
  origin: z.string(),
  location: z.string(),
  episodeCount: z.number(),
});

export const characterPageSchema = z.object({
  info: z.object({
    pages: z.number(),
    count: z.number(),
  }),
  results: z.array(characterSchema),
});

export type CharacterApiModel = z.infer<typeof characterSchema>;
export type CharacterPageApiModel = z.infer<typeof characterPageSchema>;
