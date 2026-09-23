# Content Collections and Dynamic Routes

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

## 1. Folder structure

```
src/
├── content.config.ts          ← in src/, NOT inside content/
└── content/
    └── postCollection/
        ├── astro-image-component.md
        ├── astro-new-features.md
        └── modern-css-techniques.md
```

> Astro 6: the config file is `content.config.ts` directly under `src/`. The old path (`src/content/config.ts`) errors at startup.

## 2. Define the collection

`./src/content.config.ts`

```typescript
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const postCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/postCollection" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
  }),
});

export const collections = {
  postCollection,
};
```

> Import `z` from `astro/zod`, not from `astro:content` (deprecated in Astro 6).

## 3. Generate TypeScript types

```bash
pnpm astro sync
```

This creates `.astro/types.d.ts` and removes the `Cannot find module 'astro:content'` editor error. `pnpm dev` keeps it updated afterwards.

## 4. Example post

`./src/content/postCollection/astro-new-features.md`

```markdown
---
title: "What's new in Astro 6"
description: "A walkthrough of the main Astro 6 features."
image: "https://example.com/astro6.jpg"
---

## Introduction

Astro 6 brings big performance improvements and the stable Content Layer API...
```

Sample posts available at: https://github.com/content-island/demos-academia-midudev-astro-hcms/tree/main/99-recursos/00-posts-md

## 5. Link to the blog from home

`./src/pages/index.astro`

```diff
  <h1>{title}</h1>
	<DogPics urls={dogImageUrls} />
	<div>
		<button id="cat-image-button">Get Cat Image</button>
	</div>
	<div>
		<img id="cat-image" style="max-width: 400px; height: auto;"/>
	</div>
	<a href="/about">Go to about page</a>
+ <a href="/blog">Go to blog page</a>
```

## 6. Blog index page

`./src/pages/blog/index.astro`

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection } from "astro:content";

const posts = await getCollection("postCollection");
---

<BaseLayout title="Blog">
  <h1>Blog</h1>
  <ul>
    {
      posts.map((post) => (
        <li>
          <a href={`/blog/${post.id}`}>{post.data.title}</a>
        </li>
      ))
    }
  </ul>
  <a href="/">Go back home</a>
</BaseLayout>
```

- `post.id` = the `.md` filename without extension.
- `post.data` = the typed frontmatter.

## 7. Dynamic post page

`./src/pages/blog/[slug].astro`

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("postCollection");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BaseLayout title={post.data.title}>
  <h1>{post.data.title}</h1>
  <img src={post.data.image} alt={post.data.title} />
  <p>{post.data.description}</p>
  <article>
    <Content />
  </article>
  <a href="/blog">Back to blog</a>
</BaseLayout>
```

- `getStaticPaths()` generates one HTML per post at build time.
- `render(post)` returns the `Content` component for the Markdown body.

---

## What's new in Astro 6

- **Content Layer stable**: the old API (`type: "content"`, `post.slug`, `post.render()`) is legacy. New API uses loaders:
  - `loader: glob({ pattern, base })` replaces `type: "content"`.
  - `post.id` replaces `post.slug`.
  - `render(post)` (imported from `astro:content`) replaces `post.render()`.
- **Swappable loaders**: same schema works for `glob()`, `file()`, or a custom loader against an API.
- **Live Content Collections (stable)**: define collections that update at request time (SSR) without re-building.

---

## Resources

- [Astro: Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro: Content Layer API and loaders](https://docs.astro.build/en/reference/content-loader-reference/)
- [Astro 5: Content Layer announcement](https://astro.build/blog/astro-5/)
- [Zod](https://zod.dev/)
