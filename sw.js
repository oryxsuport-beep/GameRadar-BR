self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of windows){if(new URL(client.url).origin===self.location.origin&&'focus' in client){return client.focus()}}
    return self.clients.openWindow('/');
  })());
});
// No push subscription or background price checks in this version.
