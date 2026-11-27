const CACHE='gameradar-offline-v3';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.add('/offline.html')).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('gameradar-offline-')&&name!==CACHE)await caches.delete(name);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{if(e.request.mode!=='navigate'||e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).catch(async()=>await caches.match('/offline.html')||new Response('GameRadar BR: sem conexão.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})))});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of windows)if(new URL(client.url).origin===self.location.origin&&'focus' in client)return client.focus();return self.clients.openWindow('/')})());
});
// Live offers are never cached by this service worker.
