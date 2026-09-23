# Recovering failed requests

So `caches.match(event.request)` is great when there is a match in the service worker cache, but what about cases when there isn't a match?

After testing the response from the cache, we can fall back on a regular network request:

Update `solution/sw.js`

```js
// .....
/*diff*/
const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  return fetch(request);
};
/*diff*/

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request));
});
```

```diff
self.addEventListener("fetch", (event) => {
- event.respondWith(caches.match(event.request));
+ event.respondWith(cacheFirst(event.request));
});
```

Using a more elaborate strategy, we could not only request the resource from the network, but also save it into the cache so that later requests for that resource could be retrieved offline too. 

Update `solution/sw.js`

```diff
.....
+const putInCache = async (request, response) => {
+ const cache = await caches.open("v1");
+ await cache.put(request, response);
+};

-const cacheFirst = async (request) => {
+const cacheFirst = async (request, event) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
- return fetch(request);
+ const responseFromNetwork = await fetch(request);
+ event.waitUntil(putInCache(request,responseFromNetwork.clone()));
+ return responseFromNetwork;
};

self.addEventListener("fetch", (event) => {
- event.respondWith(cacheFirst(event.request));
+ event.respondWith(cacheFirst(event.request, event));
});
```

We put a clone of the response into the cache. The `putInCache()` function uses `caches.open('v1')` and `cache.put()` to add the resource to the cache.

Cloning the response is necessary because request and response streams can only be read once. In order to return the response to the browser and put it in the cache we have to clone it. So the original gets returned to the browser and the clone gets sent to the cache. They are each read once.

What might look a bit weird is that the promise returned by `putInCache()` is not awaited. The reason is that we don't want to wait until the response clone has been added to the cache before returning a response. However, we do need to call `event.waitUntil()` on the promise, to make sure the service worker doesn't terminate before the cache is populated.

The only trouble we have now is that if the request doesn't match anything in the cache, and the network is not available, our request will still fail. Let's provide a default fallback:

Update `solution/sw.js`

```diff
....
-const cacheFirst = async (request, event) => {
+const cacheFirst = async ({ request, fallbackUrl, event }) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

- const responseFromNetwork = await fetch(request);
- event.waitUntil(putInCache(request, responseFromNetwork.clone()));
- return responseFromNetwork;
+ try {
+   const responseFromNetwork = await fetch(request);
+   event.waitUntil(putInCache(request, responseFromNetwork.clone()));
+   return responseFromNetwork;
+ } catch (error) {
+   const fallbackResponse = await caches.match(fallbackUrl);
+   if (fallbackResponse) {
+     return fallbackResponse;
+   }
+
+   return new Response("Network error happened", {
+     status: 408,
+     headers: { "Content-Type": "text/plain" },
+   });
+ }
};

self.addEventListener("fetch", (event) => {
- event.respondWith(cacheFirst(event.request, event));
+ event.respondWith(
+   cacheFirst({
+     request: event.request,
+     fallbackUrl: "/gallery/isengerd.jpeg",
+     event,
+   })
+ );
});
```

```bash
npm run serve
```