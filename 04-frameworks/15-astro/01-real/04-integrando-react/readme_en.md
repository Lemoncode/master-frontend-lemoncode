# 04 React integration

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Add a React "like" button as a client island.

## 1. Install React

```bash
pnpm add react react-dom @types/react @types/react-dom @astrojs/react
```

`./astro.config.mjs`

```diff
// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
+ import react from '@astrojs/react';

export default defineConfig({
+  integrations: [react()],
  vite: {
    plugins: /** @type {any} */ ([tailwindcss()]),
  },
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

## 2. React component

`./src/pods/post/components/like-button.component.tsx`

```tsx
import { useState, useEffect } from 'react';

export const LikeButton: React.FC = () => {
  const [likes, setLikes] = useState<number>(0);

  useEffect(() => {
    const storedLikes = localStorage.getItem('likes');
    if (storedLikes) {
      setLikes(parseInt(storedLikes, 10));
    }
  }, []);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem('likes', newLikes.toString());
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        className="group w-fit cursor-pointer rounded-full p-1 transition-colors duration-300"
        aria-label="Like"
        title="Like this post"
        onClick={handleLike}
      >
        <svg
          aria-hidden="true"
          className="h-5.5 w-5.5 flex items-center justify-center transition-colors duration-300 group-hover:text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 19.75a.75.75 0 0 1-.53-.22L4.7 12.74a5 5 0 0 1 0-7a4.95 4.95 0 0 1 7 0L12 6l.28-.28a4.92 4.92 0 0 1 3.51-1.46a4.92 4.92 0 0 1 3.51 1.45a5 5 0 0 1 0 7l-6.77 6.79a.75.75 0 0 1-.53.25m-3.79-14a3.44 3.44 0 0 0-2.45 1a3.48 3.48 0 0 0 0 4.91L12 17.94l6.23-6.26a3.47 3.47 0 0 0 0-4.91a3.4 3.4 0 0 0-2.44-1a3.44 3.44 0 0 0-2.45 1l-.81.81a.77.77 0 0 1-1.06 0l-.81-.81a3.44 3.44 0 0 0-2.45-1.02"
          />
        </svg>
      </button>
      <span className="text-xs">{likes}</span>
    </div>
  );
};

export default LikeButton;
```

## 3. Use it from Astro

`./src/pods/post/components/body.astro`

```diff
---
- import HeartIcon from '#assets/icons/heart.svg';
+ import LikeButton from './like-button.component.tsx';
import type { Post } from '#pods/post-collection/post-collection.model';
import MarkdownRenderer from '#components/markdown-renderer.astro';

interface Props {
  entry: Post;
  likeCount: number;
  minReadText: string;
}

const { entry, likeCount, minReadText } = Astro.props;
---
```

```diff
  <div class="border-tbase-500/40 mb-2 flex items-center justify-between gap-4 border-y py-2">
    <p class="text-xs">{entry.readTime} {minReadText}</p>
-    <div class="flex items-center">
-      <button
-        type="button"
-        class="group w-fit cursor-pointer rounded-full p-1 transition-colors duration-300"
-        aria-label="Like"
-      >
-        <HeartIcon class="h-5.5 w-5.5 transition-colors duration-300 group-hover:text-red-500" />
-      </button>
-      <span class="text-xs">{likeCount}</span>
-    </div>
+    <LikeButton client:load />
  </div>
  <MarkdownRenderer content={entry.content} />
```

> Without `client:load` the button renders but is dead (SSR only). Other directives: `client:idle`, `client:visible`, `client:only`.

```bash
pnpm dev
```

---

## What's new in Astro 6

- **React 19 compatible**: install `react@^19` + `react-dom@^19` + `@astrojs/react@^5`.
- **SSR ~2x faster** for React islands.
- **`client:*` directives unchanged**.

---

## Resources

- [Astro: React integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro: Client directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [React 19 release notes](https://react.dev/blog/2024/12/05/react-19)
