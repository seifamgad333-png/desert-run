var C="desert-run-v2",FILES=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){})}));
  }));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(n){return n!==C}).map(function(n){return caches.delete(n)}));
  }));
  self.clients.claim();
});
function nf(e){
  return new Promise(function(res){
    var done=false;
    function fin(r){if(!done&&r){done=true;res(r)}}
    function fb(){return caches.match(e.request).then(function(m){return m||caches.match("./index.html")})}
    var tm=setTimeout(function(){fb().then(fin)},3000);
    fetch(e.request).then(function(r){
      clearTimeout(tm);
      if(r.ok){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp)})}
      fin(r);
    }).catch(function(){
      clearTimeout(tm);
      fb().then(function(m){if(m)fin(m);else if(!done){done=true;res(Response.error())}});
    });
  });
}
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  if(new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(nf(e));
});
