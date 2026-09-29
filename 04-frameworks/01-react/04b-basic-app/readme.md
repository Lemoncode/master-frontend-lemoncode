# 04 Basic app — Rick & Morty

An app with login against our own server, a list and a detail page. Each step starts from the previous one; the last one (`05-detail`) is the code as we left it in class and the starting point of `../05-architecture`.

| Step | What you'll see |
| --- | --- |
| `00-boilerplate` | Vite + React Compiler + Tailwind/daisyUI, Hono server and proxy |
| `01-routing` | React Router: routes, layout and private routes |
| `02-login` | Login against the server, `httpOnly` cookie session |
| `03-login-zod` | Form validation with zod |
| `04-list` | List: `useEffect`, loading and error states, cards |
| `05-detail` | Detail: `useParams`, effect dependencies, zod `.extend`, episodes table |

## Annexes

What we didn't have time for in class is covered in `../05-architecture`: zod in the list in `04-api`, and actions, live validation and Suspense in its final annexes.

Each folder has its own `readme.md` / `readme_es.md` summarising the step.

```bash
pnpm install
pnpm start
```

User: `admin` / `test`.
