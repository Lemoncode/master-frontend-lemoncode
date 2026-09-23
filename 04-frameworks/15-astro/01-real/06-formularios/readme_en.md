# Server Action form with Resend

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Newsletter form: when a user subscribes, send an email via Resend through an Astro Action.

## 1. Install Resend

```bash
pnpm add resend
```

Create a [Resend](https://resend.com/) account and get an API key. For testing use `onboarding@resend.dev` as the sender.

## 2. Env vars

`.env`

```
FROM_EMAIL=your_verified_email_here
TO_EMAIL=recipient_email_here
RESEND_API_KEY=your_resend_api_key_here
```

`./astro.config.mjs`

```diff
export default defineConfig({
  env: {
    schema: {
+      RESEND_API_KEY: envField.string({
+        context: 'server',
+        access: 'secret',
+        optional: false,
+        default: 'INFORM_VALID_TOKEN',
+      }),
+    FROM_EMAIL: envField.string({
+        context: 'server',
+        access: 'secret',
+        optional: false,
+        default: 'INFORM_VALID_EMAIL',
+      }),
+    TO_EMAIL: envField.string({
+        context: 'server',
+        access: 'secret',
+        optional: false,
+        default: 'INFORM_VALID_EMAIL',
+      }),
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

## 3. Add the action

`./src/actions/index.ts`

```diff
+import { Resend } from 'resend';
+import { RESEND_API_KEY, FROM_EMAIL, TO_EMAIL } from 'astro:env/server';
+import { z } from "astro/zod";

+const resend = new Resend(RESEND_API_KEY);

export const server = {
  addLike: defineAction<LikesResponse>({
    async handler(slug) {
      return { likes: await addLike(slug) };
    },
  }),
  getLikes: defineAction<LikesResponse>({
    async handler(slug) {
      return { likes: await getLikes(slug) };
    },
  }),
+  sendSubscription: defineAction({
+    accept: 'form',
+    input: z.object({
+      email: z.email('Invalid email'),
+    }),
+    handler: async input => {
+      try {
+        const { email } = input;
+        await resend.emails.send({
+          from: FROM_EMAIL,
+          to: TO_EMAIL,
+          subject: 'Hello World',
+          html: `<p>Congrats on sending your <strong>${email}</strong>!</p>`,
+        });
+        return { success: true, message: 'E-mail sent successfully ✅' };
+      } catch (error) {
+        return { success: false, message: 'There was an error sending the e-mail ❌' };
+      }
+    },
+  }),
};
```

## 4. Wire the wide newsletter form

`./src/pods/newsletter/components/newsletter-wide.astro`

```diff
<section >
    <form
+      id="newsletter-form-wide"
+      method="POST"
    >
    //(...)
    </form>
</section>


+<script>
+  import { actions } from 'astro:actions';
+  const form = document.getElementById('newsletter-form-wide');

+  const handleSubmit = async (event: Event) => {
+    event.preventDefault();
+    const form = event.target as HTMLFormElement;
+    const sendFormData = new FormData(form);
+    const result = await actions.sendSubscription(sendFormData);
+    if (result.data?.success) {
+      form.reset();
+    }
+  };

+  if (form && form instanceof HTMLFormElement) {
+    form.addEventListener('submit', e => handleSubmit(e));
+  }
+</script>
```

## 5. Extract the submit handler

`./src/pods/newsletter/newsletter.business.ts`

```ts
import { actions } from 'astro:actions';

export const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const sendFormData = new FormData(form);
  const result = await actions.sendSubscription(sendFormData);
  if (result.data?.success) {
    form.reset();
  }
};
```

`./src/pods/newsletter/components/newsletter-wide.astro`

```diff
<script>
-  import { actions } from 'astro:actions';
+  import { handleSubmit } from '../newsletter.business';
  const form = document.getElementById('newsletter-form-wide');

-  const handleSubmit = async (event: Event) => {
-    event.preventDefault();
-    const form = event.target as HTMLFormElement;
-    const sendFormData = new FormData(form);
-    const result = await actions.sendSubscription(sendFormData);
-    if (result.data?.success) {
-      form.reset();
-    }
-  };

  if (form && form instanceof HTMLFormElement) {
     form.addEventListener('submit', e => handleSubmit(e));
  }
</script>
```

## 6. Wire the mini newsletter form

`./src/pods/newsletter/components/newsletter-mini.astro`

```diff
    <form
      class="border-text relative flex items-center justify-between gap-2 rounded-xl border py-2 pr-2 pl-4"
+      id="newsletter-form-mini"
+      method="POST"
      >
     ...
    </form>
</section>

+<script>
+  import { handleSubmit } from '../newsletter.business';
+  const form = document.getElementById('newsletter-form-mini');

+  if (form && form instanceof HTMLFormElement) {
+    form.addEventListener('submit', e => handleSubmit(e));
+  }
+</script>
```

---

## What's new in Astro 6

- **`astro:schema` + Zod 4**: `import { z } from "astro:schema"` uses Zod 4 bundled with Astro 6 — no separate install.
- **`accept: "form"` stable**: action receives `FormData` directly; works with plain HTML forms (optionally enhanced with JS).

---

## Resources

- [Astro: Server Actions with forms](https://docs.astro.build/en/guides/actions/#use-actions-from-html-form-actions)
- [Resend docs](https://resend.com/docs)
- [Zod 4](https://zod.dev/)
