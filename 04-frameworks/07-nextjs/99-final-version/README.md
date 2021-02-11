# Borrar

-  .babelrc
-  package.json:
  - scripts: start:dev start:prod
  - dependencies: @emotion/css, @emotion/server, next
  - devDependencies: @emotion/babel-plugin, @types/node (required by ts)

- tsconfig.json: Nextjs added it if we use .tsx extension files, It adds `next-env.d.ts` too.

- "next start" after "next build" for run servers with custom deployments (outside vercel)

# Debugging: https://nextjs.org/docs/advanced-features/debugging

# ENV variables: https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables

# Custom App: https://nextjs.org/docs/advanced-features/custom-app

# Images

- https://nextjs.org/docs/api-reference/next/image#required-props
- https://github.com/vercel/next.js/tree/canary/examples/image-component/pages


[Nextjs examples with custom webpack proxy](https://github.com/vercel/next.js/tree/master/examples/with-custom-reverse-proxy)
