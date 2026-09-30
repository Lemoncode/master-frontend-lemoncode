# 05 Architecture — where does each thing go?

Starts from `../04b-basic-app/05-detail`. **No new features**: the app does the same at the end, but organised in layers and pods.

| Step | What you'll see |
| --- | --- |
| `00-teoria` | By type, by page and by pods; layers and pod anatomy (docs only) |
| `01-scenes` | `#` alias, `core/router`, `core/auth`, `layouts`, `scenes` |
| `02-cross-cutting` | The session in a context (no more prop drilling) |
| `03-pods` | Container + component + barrel per screen; spinner and error to `common` |
| `04-api` | api + api model (zod) + view model + mapper; validation moves up to `common` |
| `anexo-a-login-actions` | *Optional.* Login with `action`, `useActionState` and `useFormStatus` (starts from `04-api`) |
| `anexo-b-login-live-validation` | *Optional.* Validation while typing (starts from `anexo-a`) |
| `anexo-c-list-suspense` | *Optional.* List with `use` and `Suspense` (starts from `04-api`) |

```
src/
├── common/    ← domain-free, can become a library
├── core/      ← cross-cutting: routes and session
├── layouts/   ← shells
├── pods/      ← functionality by domain
└── scenes/    ← screens: layout + pod
```

Each folder has its own `readme.md` / `readme_es.md` summarising the step.
