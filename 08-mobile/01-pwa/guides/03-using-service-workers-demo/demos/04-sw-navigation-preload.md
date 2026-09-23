# Service Worker navigation preload

If enabled, the [navigation preload](https://developer.mozilla.org/en-US/docs/Web/API/NavigationPreloadManager) feature starts downloading resources as soon as the fetch request is made, and in parallel with service worker activation. This ensures that download starts immediately on navigation to a page, rather than having to wait until the service worker is activated.

First the feature must be enabled during service worker activation, using registration.[navigationPreload.enable()](https://developer.mozilla.org/en-US/docs/Web/API/NavigationPreloadManager/enable):

Update `solution/sw.js`

```diff
....
self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: "/gallery/myLittleVader.jpg",
      event,
    })
  );
});
+
+self.addEventListener("activate", (event) => {
+ event.waitUntil(self.registration?.navigationPreload.enable());
+});

```

Continuing the example from the previous sections, we insert the code to wait for the preloaded resource after the cache check, and before fetching from the network if that doesn't succeed.

The new process is:

1. Check cache
2. Wait on `event.preloadResponse`, which is passed as `preloadResponsePromise` to the `cacheFirst()` function. Cache the result if it returns.
3. If neither of these are defined then we go to the network.

```diff
-const cacheFirst = async ({ request, fallbackUrl, event }) => {
+const cacheFirst = async ({
+ request,
+ preloadResponsePromise,
+ fallbackUrl,
+ event,
+}) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
+
+ const preloadResponse = await preloadResponsePromise;
+ if (preloadResponse) {
+   console.info("using preload response", preloadResponse);
+   event.waitUntil(putInCache(request, preloadResponse.clone()));
+   return preloadResponse;
+ }
+ 
  try {
    const responseFromNetwork = await fetch(request);
    event.waitUntil(putInCache(request, responseFromNetwork.clone()));
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }

    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
```

```diff
....
self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
+     preloadResponsePromise: event.preloadResponse,
      fallbackUrl: "/gallery/isengerd.jpeg",
      event,
    })
  );
});
+
+const enableNavigationPreload = async () => {
+ if (self.registration.navigationPreload) {
+   await self.registration.navigationPreload.enable();
+ }
+};
+
self.addEventListener("activate", (event) => {
- event.waitUntil(self.registration?.navigationPreload.enable());
+ event.waitUntil(enableNavigationPreload());
});
```