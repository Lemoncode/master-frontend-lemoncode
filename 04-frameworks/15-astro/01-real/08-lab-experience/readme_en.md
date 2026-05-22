# 08 Experience Lab

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Practice exercise: fill the empty _About_ page with the author's work experience list, pulled from Content Island.

## 1. Goal

Empty starting state:

![Empty experience placeholder](./content/empty-experience.jpg)

Target:

![Full experience list](./content/experience-completed.jpg)

## 2. Content Island model

![Experience and ExperienceSection model](./content/model.jpg)

- **Experience Section**: list header + nested experiences.
- **Experience**: single role.

## 3. Define the model

`./src/pods/experience-collection/experience-collection.model.ts`

```ts
export interface Experience {
  id: string;
  language: "en";
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface ExperienceSection {
  id: string;
  language: "en";
  title: string;
  experienceCollection: Experience[];
}
```

## 4. API call (include the nested collection)

`./src/pods/experience-collection/experience-collection.api.ts`

```ts
import client from "#lib/client.ts";
import type { ExperienceSection } from "./experience-collection.model";

export const getExperience = async () =>
  await client.getContent<ExperienceSection>({
    contentType: "ExperienceSection",
    includeRelatedContent: true,
  });
```

## 5. Use it in the pod (unstyled)

`./src/pods/experience-collection/experience-collection.pod.astro`

```diff
---
- const experienceContent = {
-  title: 'Experience',
- };
+ import { getExperience } from "./experience-collection.api";
+ const experienceContent = await getExperience();
---

<section class="flex flex-1 flex-col gap-10 px-6" aria-labelledby="experience-section-heading">
-  <h2 class="text-tbase-500/90 text-3xl font-bold" id="experience-section-heading">{experienceContent.title}</h2>
+ <h2 class="text-tbase-500/90 text-3xl font-bold" id="experience-section-heading">{experienceContent.title}</h2>
+  <ul>
+    {experienceContent.experienceCollection.map((experience) => (
+      <li>
+        <p>{experience.role} @ {experience.company}</p>
+        <p>{experience.period}</p>
+        <p>{experience.description}</p>
+      </li>
+    ))}
+  </ul>
</section>
```

## 6. Add styles

```diff
<section class="flex flex-1 flex-col gap-10 px-6" aria-labelledby="experience-section-heading">
  <h2 class="text-tbase-500/90 text-3xl font-bold" id="experience-section-heading">{experienceContent.title}</h2>

-  <ul>
-    {experienceContent.experienceCollection.map((experience) => (
-      <li>
-        <p>{experience.role} @ {experience.company}</p>
-        <p>{experience.period}</p>
-        <p>{experience.description}</p>
-      </li>
-      ))}
-  </ul>
+  <div class="pl-4">
+    {
+      experienceContent.experienceCollection.map(exp => (
+        <div class="relative flex items-baseline gap-4 before:absolute before:top-5 before:left-[5px] before:z-[-1] before:h-full before:w-0.5 before:bg-gray-300 last:before:hidden">
+          <div class="flex flex-col">
+            <div class="bg-primary-700 dark:border-primary-50 dark:shadow-primary-50 h-3 w-3 rounded-full shadow-[0_0_0_4px] shadow-white dark:shadow-[0_0_0_5px]" />
+          </div>
+
+          <article class="pb-10">
+            <h3 class="text-primary-700 text-lg font-bold">
+              {exp.company} – {exp.role}
+            </h3>
+            <span class="text-tbase-500/90 mb-2 block text-sm font-semibold">{exp.period}</span>
+            <p>{exp.description}</p>
+          </article>
+        </div>
+      ))
+    }
+  </div>
</section>
```

```bash
pnpm dev
```

---

## Resources

- [Astro: Components and templates](https://docs.astro.build/en/basics/astro-components/)
- [Content Island — `includeRelatedContent`](https://docs.contentisland.net/)
