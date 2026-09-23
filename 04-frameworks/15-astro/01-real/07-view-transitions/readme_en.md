# 07 View Transitions

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Smooth page-to-page animations using Astro's `ClientRouter`.

## 1. Add the router

`./src/layouts/layout.astro`

```diff
---
+import { ClientRouter } from "astro:transitions";
// (...)
---
<head>
... other head elements ...
+<ClientRouter />
</head>
```

## 2. Name the shared transition element

`./src/pods/post/components/body.astro`

```diff
<h1
class="text-tbase-500/90 text-5xl leading-[1.1] font-bold"
id="article-section-heading"
+transition:name={`${entry.title}-title`}
  >
```

`./src/pods/post-collection/components/post-card.astro`

```diff
<h3
class="group-hover:text-primary-700 text-tbase-500/90 text-xl font-bold transition-colors duration-300"
+ transition:name={`${post.title}-title`}
>
```

## 3. Fix dark-mode toggle across transitions

`./src/components/header.astro`

```diff
- <script>
-  const button = document.getElementById('theme-toggle');
-  const html = document.documentElement;
-  const storedTheme = localStorage.getItem('theme');
-
-  if (storedTheme) {
-    html.classList.toggle('dark', storedTheme === 'dark');
-  }
-  if (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
-    html.classList.add('dark');
-  }
-
-  button?.addEventListener('click', () => {
-    html.classList.toggle('dark');
-    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
-  });
- </script>
+ <script>
+  const handleThemeToggle = () => {
+    const html = document.documentElement;
+    html.classList.toggle("dark");
+    localStorage.setItem(
+      "theme",
+      html.classList.contains("dark") ? "dark" : "light"
+    );
+  };
+
+  const initThemeToggle = () => {
+    const button = document.getElementById("theme-toggle");
+    const html = document.documentElement;
+    const storedTheme = localStorage.getItem("theme");
+
+    if (storedTheme) {
+      html.classList.toggle("dark", storedTheme === "dark");
+    }
+    if (
+      !storedTheme &&
+      window.matchMedia("(prefers-color-scheme: dark)").matches
+    ) {
+      html.classList.add("dark");
+    }
+
+    button?.removeEventListener("click", handleThemeToggle);
+    button?.addEventListener("click", handleThemeToggle);
+  };
+
+  initThemeToggle();
+
+  document.addEventListener("astro:after-swap", initThemeToggle);
+ </script>
```

---

## What's new in Astro 6

- **`<ClientRouter />` replaces `<ViewTransitions />`** (alias still works, but prefer the new name).
- **Lifecycle events unchanged**: `astro:before-preparation`, `astro:after-preparation`, `astro:before-swap`, `astro:after-swap`, `astro:page-load`.

---

## Heads-up

- A component's `<script>` runs **once** on initial load. After a view transition the DOM swaps but scripts don't re-run — hook `astro:after-swap` to re-init listeners.
- Apply dark mode on `document.documentElement` (survives the swap) and persist in `localStorage`.

---

## Resources

- [Astro: View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- [`<ClientRouter />` reference](https://docs.astro.build/en/guides/view-transitions/#enable-view-transitions-spa-mode)
- [MDN: View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
