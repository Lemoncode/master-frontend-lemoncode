# 03 Post Detail

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Build the dynamic post detail page using `getStaticPaths` and the `slug` field.

## 1. Rename to a dynamic route

Rename `./src/pages/posts/index.astro` → `./src/pages/posts/[slug].astro`.

## 2. Generate the paths

`./src/pages/posts/[slug].astro`

```astro
---
import Layout from '#layouts/layout.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';

export async function getStaticPaths() {
  const postEntries = await getAllPosts();
  return postEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
---
```

## 3. Quick check

```diff
---
- <h1>Hey I'm the post detail</h1>
+ <Layout title={entry.title}>
+  <h2>{entry.title}</h2>
+ </Layout>
```

```bash
pnpm dev
```

## 4. Add the hero

```diff
---
import Layout from '#layouts/layout.astro';
+ import Hero from '#components/hero.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
```

```diff
---
 <Layout title={entry.title}>
+  <Hero url={entry.image.url} slot="hero" />
  <h2>{entry.title}</h2>
 </Layout>
```

## 5. Aside slots

```diff
---
import Layout from '#layouts/layout.astro';
import Hero from '#components/hero.astro';
+ import MiniBioPod from '#pods/mini-bio/mini-bio.pod.astro';
+ import NewsletterPod from '#pods/newsletter/newsletter.pod.astro';
+ import PopularPostsPod from '#pods/popular-posts/popular-posts.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
```

```diff
---
 <Layout title={entry.title}>
  <Hero url={entry.image.url} slot="hero" />
  <h2>{entry.title}</h2>
+  <Fragment slot="aside">
+    <MiniBioPod type="card" />
+    <NewsletterPod type="mini" />
+    <PopularPostsPod />
+  </Fragment>

 </Layout>
```

## 6. Create the `post` pod

`./src/pods/post/post.pod.astro`

```astro
---
import type { Post } from '#pods/post-collection/post-collection.model';

interface Props {
  postEntry: Post;
}

const { postEntry } = Astro.props;

const likeCount = 6;

const postContent = {
  backButton: 'Go back',
  published: 'Published',
  minRead: 'min read',
};
---

<section class="flex shrink-1 grow flex-col gap-12 px-6 py-4">
  <div>{postEntry.title}</div>
  <div>{postEntry.content}</div>
</section>
```

## 7. Use the pod in the page

`./src/pages/posts/[slug].astro`

```diff
---
import Layout from '#layouts/layout.astro';
import Hero from '#components/hero.astro';
import MiniBioPod from '#pods/mini-bio/mini-bio.pod.astro';
import NewsletterPod from '#pods/newsletter/newsletter.pod.astro';
import PopularPostsPod from '#pods/popular-posts/popular-posts.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
+ import PostPod from '#pods/post/post.pod.astro';

export async function getStaticPaths() {
  const postEntries = await getAllPosts();
  return postEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
---

<Layout title={entry.title}>
  <Hero url={entry.image.url} slot="hero" />
-  <h2>{entry.title}</h2>
+  <PostPod postEntry={entry} />
  <Fragment slot="aside">
    <MiniBioPod type="card" />
    <NewsletterPod type="mini" />
    <PopularPostsPod />
  </Fragment>
</Layout>
```

## 8. Header component

`./src/pods/post/components/header.astro`

```astro
---
import ArrowLeftIcon from '#assets/icons/arrow-left.svg';

interface Props {
  gobackText: string;
  publishedText: string;
  date: string;
}
const { gobackText, publishedText, date } = Astro.props;
---

<header class="flex items-start justify-between">
  <a href="/" class="hover:text-primary-600 flex items-center gap-2 font-semibold transition-colors">
    <ArrowLeftIcon />
    {gobackText}
  </a>

  <p class="text-sm">
    {publishedText}{' '}
    <time datetime={date}>
      {
        new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
    </time>
  </p>
</header>
```

`./src/pods/post/post.pod.astro`

```diff
---
import type { Post } from '#pods/post-collection/post-collection.model';
+ import Header from '#pods/post/components/header.astro';

// (...)
---

<section class="flex shrink-1 grow flex-col gap-12 px-6 py-4">
+ <Header gobackText={postContent.backButton} publishedText={postContent.published} date={postEntry.date} />
  <div>{postEntry.title}</div>
  <div>{postEntry.content}</div>
</section>
```

## 9. Body component

`./src/pods/post/components/body.astro`

```astro
---
import HeartIcon from '#assets/icons/heart.svg';
import type { Post } from '#pods/post-collection/post-collection.model';

interface Props {
  entry: Post;
  likeCount: number;
  minReadText: string;
}

const { entry, likeCount, minReadText } = Astro.props;
---

<div class="flex flex-col gap-6">
  <h1 class="text-tbase-500/90 text-5xl leading-[1.1] font-bold" id="article-section-heading">
    {entry.title}
  </h1>

  <div class="border-tbase-500/40 mb-2 flex items-center justify-between gap-4 border-y py-2">
    <p class="text-xs">{entry.readTime} {minReadText}</p>
    <div class="flex items-center">
      <button
        type="button"
        class="group w-fit cursor-pointer rounded-full p-1 transition-colors duration-300"
        aria-label="Like"
      >
        <HeartIcon class="h-5.5 w-5.5 transition-colors duration-300 group-hover:text-red-500" />
      </button>
      <span class="text-xs">{likeCount}</span>
    </div>
  </div>
  <div>{entry.content}</div>
</div>
```

`./src/pods/post/post.pod.astro`

```diff
---
import type { Post } from '#pods/post-collection/post-collection.model';
import Header from '#pods/post/components/header.astro';
+ import Body from '#pods/post/components/body.astro';

// (...)
---

<section class="flex shrink-1 grow flex-col gap-12 px-6 py-4">
  <Header gobackText={postContent.backButton} publishedText={postContent.published} date={postEntry.date} />
+  <Body entry={postEntry} likeCount={likeCount} minReadText={postContent.minRead} />
-  <div>{postEntry.title}</div>
-  <div>{postEntry.content}</div>
</section>
```

## 10. Render Markdown content

`./src/pods/post/components/body.astro`

```diff
---
import HeartIcon from '#assets/icons/heart.svg';
import type { Post } from '#pods/post-collection/post-collection.model';
+ import MarkdownRenderer from '#components/markdown-renderer.astro';
---
```

```diff
      <span class="text-xs">{likeCount}</span>
    </div>
  </div>
-  <div>{entry.content}</div>
+  <MarkdownRenderer content={entry.content} />
</div>
```

```bash
pnpm dev
```

---

## Resources

- [Astro: Dynamic routes and `getStaticPaths()`](https://docs.astro.build/en/guides/routing/#dynamic-routes)
- [marked](https://marked.js.org/)
- [highlight.js](https://highlightjs.org/)
