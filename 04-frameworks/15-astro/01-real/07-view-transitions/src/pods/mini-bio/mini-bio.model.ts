export type MiniBioType = 'hero' | 'card';

import type { Media } from '@content-island/api-client';

export interface MiniBio {
  id: string;
  language: 'en';
  lastUpdate: string; // Stores the date in ISO 8601 format. For example: 2021-09-10T19:30:00.000Z
  title: string;
  name: string;
  role: string;
  description: string;
  image: Media;
  imageAlt: string;
}
