// Negotiate gzip for the public, static HTML only. Never compress private admin responses.
export function acceptsGzip(header){
 if(typeof header!=='string'||header.length>2048)return false;
 let gzip=null,wildcard=null;
 for(const entry of header.split(',')){
  let [coding,...params]=entry.trim().toLowerCase().split(';'),q=1;
  for(const p of params){const m=/^\s*q\s*=\s*(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)\s*$/.exec(p);if(p.trim().startsWith('q')&&!m)q=0;else if(m)q=Number(m[1])}
  if(coding.trim()==='gzip')gzip=q;else if(coding.trim()==='*')wildcard=q;
 }
 return (gzip??wildcard??0)>0;
}
export function coalesce(load,{ttl=60000,now=Date.now}={}){
 let entry=null,pending=null;
 return async function(){if(entry&&now()-entry.at<ttl)return entry.value;if(pending)return pending;const task=Promise.resolve().then(load).then(value=>{entry={at:now(),value};return value});pending=task;try{return await task}finally{if(pending===task)pending=null}}
}
