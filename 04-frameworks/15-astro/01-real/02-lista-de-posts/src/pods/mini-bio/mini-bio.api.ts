import client from '#lib/client.ts';
import type { MiniBio } from './mini-bio.model';

export const getMiniBio = async () =>
  await client.getContent<MiniBio>({
    contentType: 'MiniBio',
  });
