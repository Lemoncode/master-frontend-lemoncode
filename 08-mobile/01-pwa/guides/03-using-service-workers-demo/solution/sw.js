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
    ]),
  );
});

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async ({
  request,
  preloadResponsePromise,
  fallbackUrl,
  event,
}) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  const preloadResponse = await preloadResponsePromise;
  console.log("preloadResponse", self.registration.navigationPreload);
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    event.waitUntil(putInCache(request, preloadResponse.clone()));
    return preloadResponse;
  }
  //   // 2. Try preload response
  //   try {
  //     const preloadResponse = await preloadResponsePromise;
  //     if (preloadResponse) {
  //       console.info("using preload response", preloadResponse);
  //       event.waitUntil(putInCache(request, preloadResponse.clone()));
  //       return preloadResponse;
  //     }
  //   } catch (error) {
  //     // Ignore errors if preload failed or was disabled
  //     console.error(error);
  //   }

  try {
    const responseFromNetwork = await fetch(request);
    event.waitUntil(putInCache(request, responseFromNetwork.clone()));
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: "/gallery/isengerd.jpeg",
      event,
    }),
  );
});

const enableNavigationPreload = async () => {
  console.log(self.registration.navigationPreload);
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("activate", (event) => {
  console.log("activate event calling");
  event.waitUntil(enableNavigationPreload());
});
