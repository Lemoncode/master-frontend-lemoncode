# Install and activate: populating your cache

After your service worker is registered, the browser will attempt to install then activate the service worker for your page/site.

The `install` event is the first event that is fired on service worker installation or update. It is emitted just once, immediately after registration is successfully completed, and is generally used to populate your browser's offline caching capabilities with the assets you need to run your app offline.

We use Service Worker's storage API - [cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) - a global object on the service worker that allows us to store assets delivered by responses, and keyed by their requests, works in a similar way to the browser's standard cache, but it is specific to your domain. The contents of the cache are kept until you clear them.

> Add `gallery` images, paste the folder in new solution root folder

> Add `lord-of-the-rings-logo.jpg`, pate it in root folder solution

Create `solution/image-list.js`

```js
export const Path = "gallery/";

export const Gallery = {
  images: [
    {
      name: "Isengerd",
      alt: "Isengerd asalt",
      url: "gallery/isengerd.jpeg",
      credit:
        'Image generated with Google Gemini.',
    },

    {
      name: "Mount Doom",
      alt: "Hobbits fight with Gollum to throw away the ring",
      url: "gallery/mount-doom.jpeg",
      credit:
        'Image generated with Google Gemini.',
    },

    {
      name: "Rivendell",
      alt: "Rivendell city toy",
      url: "gallery/rivendell.jpeg",
      credit:
        'Image generated with Google Gemini.',
    },
  ],
};
```

Update `app.js`

```js
// ...

/*diff*/
const imgSection = document.querySelector("section");

const getImageBlob = async (url) => {
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) {
    throw new Error(
      `Image did not load; error code: ${
        imageResponse.statusText || imageResponse.status
      }`
    );
  }
  return imageResponse.blob();
};

const createGalleryFigure = async (galleryImage) => {
  try {
    const imageBlob = await getImageBlob(galleryImage.url);
    const myImage = document.createElement("img");
    const myCaption = document.createElement("caption");
    const myFigure = document.createElement("figure");
    const myName = document.createElement("span");
    myName.textContent = `${galleryImage.name}: `;
    const myCredit = document.createElement("span");
    myCredit.innerHTML = `Taken by ${galleryImage.credit}`;
    myCaption.append(myName, myCredit);
    myImage.src = window.URL.createObjectURL(imageBlob);
    myImage.setAttribute("alt", galleryImage.alt);
    myFigure.append(myImage, myCaption);
    imgSection.append(myFigure);
  } catch (error) {
    console.error(error);
  }
};
/* diff */

registerServiceWorker();
```

```diff
+import { Gallery } from "./image-list.js";

const isServiceWorkerAvailable = () => "serviceWorker" in navigator;
....
....
....
registerServiceWorker();
+Gallery.images.map(createGalleryFigure);
```

```bash
npm run serve
```

We can see our application running but if we open dev tools, we see an error related with the service worker that we are trying to install, that's ok since we didn't create or service worker file yet. Lets start by handling the `install` event as follows:

Create `solution/sw.js`

```js
const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/style.css",
      "/app.js",
      "/image-list.js",
      "/lord-of-the-rings-logo.jpeg",
      "/gallery/isengerd.jpeg",
      "/gallery/mount-doom.jpeg",
      "/gallery/rivendell.jpeg",
    ])
  );
});
```

1. Here we add an install event listener to the service worker (hence self), and then chain a `ExtendableEvent.waitUntil()` method onto the event — this ensures that the service worker will not install until the code inside `waitUntil()` has successfully occurred.
2. Inside `addResourcesToCache()` we use the `caches.open()` method to create a new cache called _v1_, which will be version 1 of our site resources cache. Then we call a function `addAll()` on the created cache, which for its parameter takes an array of URLs to all the resources you want to cache. The URLs are relative to the worker's location.
3. If the promise is rejected, the installation fails, and the worker won't do anything. This is OK, as you can fix your code and then try again the next time registration occurs.
4. After a successful installation, the service worker activates. This doesn't have much of a distinct use the first time your service worker is *installed/activated*, but it means more when the service worker is updated

```bash
npm run serve
```

## Custom responses to requests

Now you've got your site assets cached, you need to tell service workers to do something with the cached content. This is done with the `fetch` event.

1. A `fetch` event fires every time any resource controlled by a service worker is fetched, which includes the documents inside the specified scope, and any resources referenced in those documents.

2. You can attach a `fetch` event listener to the service worker, then call the `respondWith()` method on the event to hijack our HTTP responses and update them with your content

Update `solution/sw.js`

```diff
....

+self.addEventListener("fetch", (event) => {
+ console.log(event);
+});
```

3. We could start by responding with the resource whose URL matches that of the network request, in each case:

Update `solution/sw.js`

```diff
...
self.addEventListener("fetch", (event) => {
- console.log(event);
+ event.respondWith(caches.match(event.request));
});
```

`caches.match(event.request)` allows us to match each resource requested from the network with the equivalent resource available in the cache, if there is a matching one available. The matching is done via URL and various headers, just like with normal HTTP requests.

<div style="background-color: white; min-height: 700px; min-width: 600px; margin: auto;">
    <img src=".resources/sw-fetch.svg">
</div>

We can try now on browser by running:

```bash
npm run serve
```
