import { createClient } from '@content-island/api-client';
import { CONTENT_ISLAND_SECRET_TOKEN } from 'astro:env/server';

const client = createClient({
  accessToken: CONTENT_ISLAND_SECRET_TOKEN,
});

export default client;
