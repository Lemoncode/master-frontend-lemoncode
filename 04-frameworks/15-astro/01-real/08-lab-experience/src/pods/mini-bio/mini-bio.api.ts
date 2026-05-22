import client from '#lib/client';
import type { MiniBio } from './mini-bio.model';

export const getMiniBio = async () =>
  await client.getContent<MiniBio>({
    contentType: 'MiniBio',
  });
