'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "316a1dd2ca3a2727bccfe80663b7190d",
"assets/AssetManifest.bin.json": "3986c9f139c2c89ac205e2059bfbeb11",
"assets/AssetManifest.json": "b88a9d3d8e014c209ff6d8c3362b835f",
"assets/assets/icons/bishop_black.svg": "cb69fc1a80edd0241466c0d47b116db2",
"assets/assets/icons/bishop_white.svg": "b99f3830dcbf60642c26befe1514ebbc",
"assets/assets/icons/custom1_black.svg": "2b75b09a8a713500b0b902f664e6de86",
"assets/assets/icons/custom1_white.svg": "6669d13fdc42971c20cc0e5cbc0b8ae7",
"assets/assets/icons/custom2_black.svg": "0b0b71b37181884d784e2b8486f3ac06",
"assets/assets/icons/custom2_white.svg": "be5df4fbcf9ca83c808a780061a2066d",
"assets/assets/icons/custom3_black.svg": "3cb835e333434b835341a29aa945bf3a",
"assets/assets/icons/custom3_white.svg": "fdd51875312e984d260c773208ff3636",
"assets/assets/icons/favicon.png": "fdc760524ea35ea2c2d49374321eeed5",
"assets/assets/icons/king_black.svg": "42966187cadc2408421d713123c9aff7",
"assets/assets/icons/king_white.svg": "4020a2b01363a0a87912f8ede70b2b51",
"assets/assets/icons/knight_black.svg": "7b95d1a433d0a64a1e34ed69ca8ad127",
"assets/assets/icons/knight_white.svg": "b243da7dc2f0791b4b6915ed2091b288",
"assets/assets/icons/pawn_black.svg": "764b75cb7219cd4c0cddf9b371f4e151",
"assets/assets/icons/pawn_white.svg": "eb90c7a8f2410e81d07257773525e338",
"assets/assets/icons/queen_black.svg": "a0fad866c97b0987dcb3a570bf0a5174",
"assets/assets/icons/queen_white.svg": "f588124f22d1841f34222678749ca6ac",
"assets/assets/icons/rook_black.svg": "7b68dc7460e1da9a4c519ed5963b8c25",
"assets/assets/icons/rook_white.svg": "0095917f84de3487e19f9d8d46876859",
"assets/assets/images/default.png": "bea6798da51a6f1526981308aafe86f7",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "c29a5f64538a4d75f2a8f4271e04b4f1",
"assets/NOTICES": "31ba4e1cf2ab969bda082c6032be4cb5",
"assets/packages/awesome_snackbar_content/assets/back.svg": "ba1c3aebba280f23f5509bd42dab958d",
"assets/packages/awesome_snackbar_content/assets/bubbles.svg": "1df6817bf509ee4e615fe821bc6dabd9",
"assets/packages/awesome_snackbar_content/assets/types/failure.svg": "cb9e759ee55687836e9c1f20480dd9c8",
"assets/packages/awesome_snackbar_content/assets/types/help.svg": "7fb350b5c30bde7deeb3160f591461ff",
"assets/packages/awesome_snackbar_content/assets/types/success.svg": "6e273a8f41cd45839b2e3a36747189ac",
"assets/packages/awesome_snackbar_content/assets/types/warning.svg": "cfcc5fcb570129febe890f2e117615e0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "300e553302520e7c42a9c94b832a2ff3",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"favicon.png": "b471c6500a6666dd09e8313ccc84c9c3",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"flutter_bootstrap.js": "0caea25c3500c75df24c0f2f75842337",
"icons/Icon-192.png": "9d3c0e6086d90ed894806194f96501ef",
"icons/Icon-512.png": "a0c5106681c87aaab5e73c312fa350cf",
"icons/Icon-maskable-192.png": "9d3c0e6086d90ed894806194f96501ef",
"icons/Icon-maskable-512.png": "a0c5106681c87aaab5e73c312fa350cf",
"index.html": "78058614863dcb1eb6bb91ea3fbd8159",
"/": "78058614863dcb1eb6bb91ea3fbd8159",
"main.dart.js": "91992c198898d9a6b2501e0a29b5f0ce",
"manifest.json": "2aad07eac24e852dcfe695af2ca2f7e7",
"version.json": "ebe8e1fac52ae8e38f2af9bc55658c7f"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
