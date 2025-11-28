import type { Media } from '@content-island/api-client';

export interface Post {
  id: string;
  language: 'en';
  lastUpdate: string; // Stores the date in ISO 8601 format. For example: 2021-09-10T19:30:00.000Z
  title: string;
  slug: string;
  date: string; // Stores the date in ISO 8601 format. For example: 2021-09-10T19:30:00.000Z
  summary: string;
  image: Media;
  content: string;
  readTime: number;
}
