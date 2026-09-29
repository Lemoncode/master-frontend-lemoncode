# 00 Boilerplate — Rick & Morty

Starting point. We don't write any app yet: the project comes set up with Vite, the React Compiler, Tailwind/daisyUI and our own server, and all we do is **start it and understand its pieces**.

## What we're going to build

An app with the Rick & Morty character catalogue:

- A **login screen** against our own server, with a cookie session.
- A **character list** with cards.
- A **detail screen** with its episodes.

Along the way: routing, **zod** validation, requests and loading states. Then, in `../05-architecture`, we organise it all with an architecture that can grow.

## The two pieces of the project

This project has **two programs** running at the same time:

| Piece      | Folder    | Port | What it does                        |
| ---------- | --------- | ---- | ----------------------------------- |
| **Front**  | `src/`    | 5173 | The React app, served by Vite       |
| **Server** | `server/` | 3000 | Our API, built with Hono            |

> ⚠️ If another project is using one of those ports, close it first: the server fails with `EADDRINUSE`. The server port can be changed with the `PORT` environment variable.

**Why our own server instead of the public Rick & Morty API?** Because some things can only be shown with a server in front:

- **Login**, with a real session stored in an `httpOnly` cookie (the page's JavaScript can't read it).
- **Breaking the contract on purpose**: the server has a "broken" mode to see how zod catches it.
- **Pre-chewed data**: the public API returns nested fields; ours flattens them and sends only what the screen needs.

## The React project

> **We use pnpm.** `pnpm install` to install, `pnpm add` instead of `npm install <package>`, and scripts without `run` (`pnpm start:server`).

It's generated with the official Vite scaffold:

```bash
pnpm create vite@latest 00-boilerplate --template react-ts
```

Three things were added on top.

### 1. The React Compiler

```bash
pnpm add -D oxc-transform-react
```

_./vite.config.ts_

```diff
  export default defineConfig({
-   plugins: [react()],
+   plugins: [react({ compiler: true })],
  })
```

The compiler **memoizes for us at build time**: no need to add `React.memo`, `useMemo` or `useCallback` by hand. Not a single component line changes.

**The difference, measured.** The home page (`src/App.tsx`) has a text field and a child component (`RenderProbe`) that counts how many times it runs. The child always receives the same prop. Type ten letters:

|                      | On load | After typing 10 letters |
| -------------------- | ------- | ----------------------- |
| **Without compiler** | 2       | **24**                  |
| **With compiler**    | 2       | **2**                   |

To see it: remove `compiler: true`, **restart Vite** (config isn't hot-reloaded) and type again.

⚠️ **Warnings:**

- If after an edit you see an impossible error (something initialised showing as `undefined`), **reload the whole page**: hot reload can keep a stale compiler cache.
- **It only optimises code that follows the Rules of React.** If a component mutates props or calls hooks inside an `if`, it's skipped.

### 2. Styles: Tailwind and daisyUI

```bash
pnpm add -D tailwindcss @tailwindcss/vite daisyui
```

_./vite.config.ts_

```diff
+ import tailwindcss from "@tailwindcss/vite";

  export default defineConfig({
-   plugins: [react({ compiler: true })],
+   plugins: [react({ compiler: true }), tailwindcss()],
  })
```

_./src/index.css_ (summarised)

```css
@import "tailwindcss";
@plugin "daisyui";

@plugin "daisyui/theme" {
  name: "portal";
  default: true;
  color-scheme: dark;
  /* base colours, primary (portal green) and error… */
}
```

- **Tailwind** gives utility classes for sizes and layout: `flex`, `gap-4`, `p-10`, `text-3xl`.
- **daisyUI** adds ready-styled components: `btn`, `card`, `input`, `badge`, `navbar`.
- The `portal` theme is custom and its colours are measured to pass **AAA** contrast.
- Fonts (Roboto and Space Grotesk) are loaded in `index.html` and declared with `@theme` in `index.css`.

> Throughout the course **we don't write our own CSS**: the focus stays on React.

### 3. The proxy

_./vite.config.ts_

```diff
  export default defineConfig({
    plugins: [react({ compiler: true }), tailwindcss()],
+   server: {
+     proxy: {
+       "/api": "http://localhost:3000",
+     },
+   },
  })
```

The front requests `/api/something` **from its own address** and Vite forwards it to the server. For the browser they're the same site, so **no CORS setup** and **the session cookie travels on its own**. In production an nginx or the server itself plays this role.

## Why does the counter go up two at a time? `<StrictMode>`

In `src/main.tsx` the app is wrapped in `<React.StrictMode>`. **It only acts in development**, running **twice** the component bodies, state initialisers and effects (mount, unmount, mount again).

It does so to **expose impure components**: if your component is pure, running it twice changes nothing. `RenderProbe` writes to a ref during render —exactly what React asks you not to do—, which is why it goes up two by two. In production, half.

⚠️ **Don't remove it because the duplicated logs are annoying.** If running twice breaks something, it was already broken.

## The server: `server/index.ts`

Built with [Hono](https://hono.dev) (similar to Express, but modern and typed) and run with `tsx`, which executes TypeScript without compiling.

| Method | Route                         | What it does                                                   |
| ------ | ----------------------------- | -------------------------------------------------------------- |
| `GET`  | `/api/health`                 | Check the server is alive                                      |
| `POST` | `/api/login`                  | Receives username and password; if valid, sets the cookie      |
| `POST` | `/api/logout`                 | Clears the cookie                                              |
| `GET`  | `/api/me`                     | Who am I, reading the cookie. `401` if there's no session      |
| `GET`  | `/api/characters?page=&name=` | A page of characters, already flattened                        |
| `GET`  | `/api/characters/:id`         | One character with its first episodes (`404` if it doesn't exist) |

- **Requests are slow on purpose** (400–800 ms) so loading states are visible.
- **Test user:** `admin` / `test`.
- **Broken mode:** `pnpm start:server:broken` returns `characterId` instead of `id`.
- **Chaos mode:** `curl -X POST http://localhost:3000/api/chaos` makes `/api/characters` answer `500`. Toggles on and off live.

The `package.json` scripts:

```json
"start": "run-p -l start:server start:front",
"start:front": "vite --host",
"start:server": "tsx watch server/index.ts",
"start:server:broken": "BREAK_API=true tsx watch server/index.ts"
```

`run-p` (from `npm-run-all2`) runs several scripts **in parallel** and `-l` labels each line with the script it comes from.

## Run it

```bash
pnpm install
pnpm start
```

> ⚠️ The first time pnpm may warn `Ignored build scripts: esbuild`. The project ships a `pnpm-workspace.yaml` with `allowBuilds: esbuild: true` to authorise it.

If you prefer two terminals: `pnpm start:server` and `pnpm start:front`.

## Try it

- Open <http://localhost:5173>: the server indicator shows **ok**. If not, only the front started.
- Type in the field and watch the child counter: it doesn't go up.
- From another terminal:

```bash
curl http://localhost:3000/api/health
curl -c cookies.txt -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test"}'
curl -b cookies.txt http://localhost:3000/api/me
curl "http://localhost:3000/api/characters?page=1&name=rick"
```

## What to look at before moving on

- `vite.config.ts`: the compiler, Tailwind and the proxy.
- `server/index.ts`: the API routes. No need to understand all of it.
- `src/App.tsx`: the home page with the compiler demo. It gets replaced in the next step.

**Next:** `01-routing` — the app stops being a single screen.
