# Posts list

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Render the list of posts from Content Island on the home page.

## 1. Create the `post-collection` pod and model

`./src/pods/post-collection/post-collection.model.ts`

```ts
import type { Media } from '@content-island/api-client';

export interface Post {
  id: string;
  language: 'en';
  title: string;
  slug: string;
  date: string; // ISO 8601, e.g. 2021-09-10T19:30:00.000Z
  summary: string;
  image: Media;
  content: string;
  readTime: number;
}
```

## 2. API: latest 6 posts, sorted desc

`./src/pods/post-collection/post-collection.api.ts`

```ts
import client from '#lib/client.ts';
import type { Post } from './post-collection.model';

export const getAllPosts = async () =>
  await client.getContentList<Post>({
    contentType: 'Post',
    sort: { 'fields.date': 'desc' },
    pagination: { take: 6 },
  });
```

## 3. Pod component — quick check

`./src/pods/post-collection/post-collection.pod.astro`

```astro
---
import { getAllPosts } from './post-collection.api.ts';

const posts = await getAllPosts();
---

<section class="flex flex-1 flex-col gap-9">
  {posts.map(post => <h2>{post.title}</h2>)}
</section>
```

## 4. Use the pod in the home page

`./src/pages/index.astro`

```diff
---
import Layout from '#layouts/layout.astro';
import { getCollection } from 'astro:content';
import Hero from '#components/hero.astro';
import MiniBioPod from '#pods/mini-bio/mini-bio.pod.astro';
import NewsletterPod from '#pods/newsletter/newsletter.pod.astro';
import PopularPosts from '#pods/popular-posts/popular-posts.astro';
+ import PostCollectionPod from '#pods/post-collection/post-collection.pod.astro';

const homeContent = {
  hero: {
    title: "John's Web Dev Blog",
    description: 'Here you can find articles about web app development.',
  },
};
---
```

```diff
  </Hero>

-  <div>Place holder for post preview collection</div>
+  <PostCollectionPod />

  <Fragment slot="aside">
```

```bash
pnpm dev
```

## 5. PostCard component

`./src/pods/post-collection/components/post-card.astro`

```astro
---
import HeartIcon from '#assets/icons/heart.svg';
import type { Post } from '../post-collection.model';

interface Props {
  post: Post;
}
const { post } = Astro.props;
const readTimeLabel = 'min read';
---
```

> Tip: pull HTML literals (like `readTimeLabel`) into frontmatter variables — easier i18n / text changes later.

```astro
<a
  href={`/posts/${post.slug}`}
  class="@container rounded-4xl group cursor-pointer transition-shadow duration-300 hover:shadow-lg"
>
  <article class="@lg:flex-row flex h-full flex-col">
    <div class="rounded-4xl @lg:flex-1 aspect-[16/9] overflow-hidden bg-gray-300">
      <img
        src={post.image.url}
        alt={post.title}
        class="rounded-4xl h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
        aria-hidden="true"
      />
    </div>
    <div class="@lg:flex-2 flex flex-1 flex-col justify-between gap-6 p-4">
      <div>
        <time datetime={post.date} class="mb-1 block text-xs">
          {
            new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }
        </time>
        <h3
          class="group-hover:text-primary-700 text-tbase-500/90 mb-2 text-xl font-bold transition-colors duration-300"
        >
          {post.title}
        </h3>
        <p class="text-sm">{post.summary}</p>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-xs">{post.readTime} {readTimeLabel}</span>
        <div class="flex items-center gap-1">
          <HeartIcon class="h-5 w-5" />
          <span class="text-xs">{6}</span>
        </div>
      </div>
    </div>
  </article>
</a>
```

## 6. Use PostCard in the pod

`./src/pods/post-collection/post-collection.pod.astro`

```diff
---
import { getAllPosts } from './post-collection.api.ts';
+ import PostCard from './components/post-card.astro';

const posts = await getAllPosts();
---

<section class="flex flex-1 flex-col gap-9">
-  {posts.map(post => <h2>{post.title}</h2>)}
+  {posts.map(post => <PostCard post={post} />)}
</section>
```

## 7. Grid layout

```diff
<section class="flex flex-1 flex-col gap-9">
+  <div class="grid max-w-[895px] gap-8 xl:grid-cols-2">

  {posts.map(post => <PostCard post={post} />)}
+  </div>

</section>
```

Clicking a card gives a 404 — fixed in the next lesson.

---

## What's new in Astro 6

- **Live Content Collections (stable)**: if you need the posts list to refresh without rebuilding (SSR), Astro 6 supports live content collections. Here we use the Content Island client directly for full query control (sort, pagination).

---

## Resources

- [Astro: Routes and pages](https://docs.astro.build/en/basics/astro-pages/)
- [Content Island — getContentList](https://docs.contentisland.net/)
