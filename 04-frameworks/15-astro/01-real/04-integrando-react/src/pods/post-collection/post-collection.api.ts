import client from '#lib/client.ts';
import type { Post } from './post-collection.model';

export const getAllPost = async () =>
  await client.getContentList<Post>({
    contentType: 'Post',
    sort: { 'fields.date': 'desc' },
    pagination: { take: 6 },
  });
