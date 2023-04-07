/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('message', event => {
	if (event.data && event.data.type === 'SKIP_WAITING')
		self.skipWaiting();
});

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

registerRoute(
	({ url }) => true,
	new NetworkFirst({ cacheName: `runtime-cache-${version}`, networkTimeoutSeconds: 45 })
);
