// Anonymous browser-tab session counts. No visitor identifiers are collected.
export function makeVisitCounter({now=()=>Date.now(),log=console.log,maxPerMinute=120}={}){
  let day='',count=0,minute=-1,accepted=0;
  return function visit(){
    const time=now(),date=new Date(time).toISOString().slice(0,10),slot=Math.floor(time/60000);
    if(day!==date){day=date;count=0}
    if(minute!==slot){minute=slot;accepted=0}
    if(accepted>=maxPerMinute)return false;
    accepted++;count++;
    log('GR_VISITS day='+day+' sessions='+count);
    return true;
  }
}
export function visitRequestAllowed(req,origin){
  const h=req.headers||{};
  return req.method==='POST'&&h.origin===origin&&(!h['sec-fetch-site']||h['sec-fetch-site']==='same-origin')&&(!h['content-length']||h['content-length']==='0')&&!h['transfer-encoding'];
}
