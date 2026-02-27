# 03 Boilerplate

Next.js is unopinionated about how you [organize your project](https://nextjs.org/docs/app/getting-started/project-structure) but it gives you some features to avoid create unnecessary routes like:

- [src directory](https://nextjs.org/docs/app/getting-started/project-structure#src-folder)

- [Store project files outside of app](https://nextjs.org/docs/app/getting-started/project-structure#store-project-files-outside-of-app)

- [Private folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders) using underscore as prefix: `_folderName`.

- [Route groups](https://nextjs.org/docs/app/getting-started/project-structure#route-groups): `(folderName)` to groups several routes under the same folder without create a new group route.

- [Image component](https://nextjs.org/docs/app/api-reference/components/image) in `./src/app/cars/layout.tsx`, differences with `<img style={{ width: 32, height: 'auto' }} src="/home-logo.png" />`.

  - If we use `img` it downloads the full image and resizes it in the browser: ~214kB.
  - If we use `Image` component it downloads the image with the size we need: ~3.2kB.
  - Try `Image` component with `blurDataURL="/home-logo-low-resolution.png"` and `placeholder="blur"`.

- [Using fonts](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

  - [Font display values](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display#values)

- [CSS-in-JS support](https://nextjs.org/docs/app/building-your-application/styling/css-in-js)

- [Material Icons discussion](https://github.com/vercel/next.js/discussions/42881)

- [Module aliases](https://nextjs.org/docs/app/getting-started/installation#set-up-absolute-imports-and-module-path-aliases)

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
