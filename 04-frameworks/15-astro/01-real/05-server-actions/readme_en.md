# Server Actions

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Move the like counter to the server using Astro Actions (Node adapter).

## 1. Install the Node adapter

```bash
pnpm add @astrojs/node
```

`./astro.config.mjs`

```diff
// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
+ import node from '@astrojs/node';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
+  adapter: node({
+    mode: 'standalone',
+  }),
  integrations: [react()],
  env: {
    schema: {
      CONTENT_ISLAND_SECRET_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_TOKEN',
      }),
    },
  },
});
```

> ⚠️ Two gotchas:
> 1. Actions must live in **`src/actions`** (not `/actions`).
> 2. Restart `pnpm dev` after adding the folder.

## 2. Model

`./src/actions/model.ts`

```ts
export type LikesResponse = {
  likes: number;
};
```

## 3. In-memory repository (per slug)

`./src/actions/repository.ts`

```ts
const likeStore: Map<string, number> = new Map();

export const getLikes = async (slug: string): Promise<number> => {
  return likeStore.get(slug) ?? 0;
};

export const addLike = async (slug: string): Promise<number> => {
  const current = likeStore.get(slug) ?? 0;
  const updated = current + 1;
  likeStore.set(slug, updated);
  return updated;
};
```

## 4. Define the actions

`./src/actions/index.ts`

```ts
import { defineAction } from 'astro:actions';
import { addLike, getLikes } from './repository';
import type { LikesResponse } from './model';

export const server = {
  addLike: defineAction<LikesResponse>({
    async handler(slug: string) {
      return { likes: await addLike(slug) };
    },
  }),
  getLikes: defineAction<LikesResponse>({
    async handler(slug: string) {
      return { likes: await getLikes(slug) };
    },
  }),
};
```

## 5. Update the React button to hit the actions

`./src/pods/post/components/like-button.component.tsx`

```diff
+ import { actions } from 'astro:actions';
import { useState, useEffect } from 'react';

+ type GetLikesResponse = Awaited<ReturnType<typeof actions.getLikes>>;

+ interface Props {
+  slug: string;
+ }

- export const LikeButton: React.FC = () => {
+ export const LikeButton: React.FC<Props> = ({ slug }) => {
  const [likes, setLikes] = useState<number>(0);

  useEffect(() => {
-    const storedLikes = localStorage.getItem('likes');
-    if (storedLikes) {
-      setLikes(parseInt(storedLikes, 10));
-    }
+    actions.getLikes(slug).then((response: GetLikesResponse) => {
+      setLikes(response?.data?.likes || 0);
+    });
- }, []);
+ }, [slug]);

  const handleLike = () => {
-    const newLikes = likes + 1;
-    setLikes(newLikes);
-    localStorage.setItem('likes', newLikes.toString());
+    actions.addLike(slug).then((response: GetLikesResponse) => {
+      setLikes(response?.data?.likes ?? 0);
+    });
  };
```

## 6. Pass the slug prop

`./src/pods/post/components/body.astro`

```diff
  <div class="border-tbase-500/40 mb-2 flex items-center justify-between gap-4 border-y py-2">
    <p class="text-xs">{entry.readTime} {minReadText}</p>
-    <LikeButton client:load />
+    <LikeButton client:load slug={entry.slug} />
  </div>
  <MarkdownRenderer content={entry.content} />
```

```bash
pnpm dev
```

---

## 7. Call actions from the server (post cards)

Replace the hardcoded `{6}` in the card with the real count, via `Astro.callAction` (in-process, no HTTP).

`./src/pods/post-collection/post-collection.pod.astro`

```diff
---
+ import { actions } from 'astro:actions';
import { getAllPosts } from './post-collection.api.js';
import PostCard from './components/post-card.astro';

const posts = await getAllPosts();

+ const postsWithLikes = await Promise.all(
+   posts.map(async post => {
+     const { data } = await Astro.callAction(actions.getLikes, post.slug);
+     return { post, likes: data?.likes ?? 0 };
+   })
+ );
---

<section class="flex flex-1 flex-col gap-9">
  <div class="grid max-w-[895px] gap-8 xl:grid-cols-2">
-    {posts.map(post => <PostCard post={post} />)}
+    {postsWithLikes.map(({ post, likes }) => <PostCard post={post} likes={likes} />)}
  </div>
</section>
```

`./src/pods/post-collection/components/post-card.astro`

```diff
interface Props {
  post: Post;
+  likes: number;
}
- const { post } = Astro.props;
+ const { post, likes } = Astro.props;
```

```diff
        <div class="flex items-center gap-1">
          <HeartIcon class="h-5 w-5" />
-          <span class="text-xs">{6}</span>
+          <span class="text-xs">{likes}</span>
        </div>
```

> `actions.X(...)` from the client → HTTP. `Astro.callAction(actions.X, input)` from a `.astro` frontmatter → in-process.

---

## What's new in Astro 6

- **Zod 4 via `astro/zod`**: no need to install Zod separately.
- **CSP stable**: `security.csp` block in `astro.config.mjs` is now stable.
- **`@astrojs/node` v10**: compatible with Astro 6, same `standalone` / `middleware` modes.

---

## Resources

- [Astro: Server Actions](https://docs.astro.build/en/guides/actions/)
- [Astro: SSR adapters](https://docs.astro.build/en/guides/server-side-rendering/)
- [`@astrojs/node`](https://docs.astro.build/en/guides/integrations-guide/node/)
