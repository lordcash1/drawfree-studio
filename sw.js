const C='drawfree-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png']).catch(()=>{})))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(!(u.origin===location.origin||/(^|\.)fonts\.(googleapis|gstatic)\.com$|^cdn\.jsdelivr\.net$/.test(u.host)))return;
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(e.request);
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>null);
    if(hit){net.catch(()=>{});return hit}
    const r=await net;if(r)return r;
    if(e.request.mode==='navigate')return (await c.match('./index.html'))||(await c.match('./'))||Response.error();
    return Response.error()}))});
