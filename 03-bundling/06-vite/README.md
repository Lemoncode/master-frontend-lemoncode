# Some notes about Vite

- Vite uses `esbuild` for development, a build tool written in Golang for bundling JavaScript and TypeScript projects like Webpack or Rollup.
  It precompiles all node_modules dependencies into ES modules to improve loadings (e.g. just import `lodash-es` and not 100-200 ES submodules)
- Vite uses Rollup for production builds. It has better support for important features like CSS handling and code-splitting.
- Vite has a scaffolding CLI tool called `vite-create` you can use to generate projects using `npm create vite <project_name>`. It has some preconfigured templates with support for TypeScript, React, Vue, Svelte...
- By default it serves the root folder, that's why `index.html` is inside root folder and not under a `public` folder.
- Vite assumes browsers have ES modules support. Target can be specified in `build.target` and the lowest value ies `es2015`. There's a plugin for legacy support (`@vitejs/plugin-legacy`) that can autogenerate legacy chunks for browsers and polyfills. Vite uses Rollup under the hood for production builds so we can tweak rollup config under `build.rollupOptions`.
