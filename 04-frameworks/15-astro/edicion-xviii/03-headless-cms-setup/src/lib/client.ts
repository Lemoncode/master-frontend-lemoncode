import { CONTENT_ISLAND_SECRET_TOKEN } from "astro:env/server";
import { createClient } from "@content-island/api-client";

const client = createClient({
  accessToken: CONTENT_ISLAND_SECRET_TOKEN,
});

export default client;
