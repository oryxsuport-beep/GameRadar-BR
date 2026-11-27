// Public game prices only. No account data or credentials are stored in observations.
const memory=new Map();
const MAX=20000;
const url=process.env.SUPABASE_URL;
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
const configured=Boolean(url&&key&&/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url));
let remoteOk=false,lastSuccess=null,lastFailure=null,retryAt=0;
const inflight=new Map();
const written=new Map();
const dirty=new Set();
const signature=row=>row.observed_at+'|'+row.price_cents+'|'+row.original_cents;
function valid(row){return /^\d{1,12}$/.test(String(row.app_id))&&row.store==='Steam Brasil'&&Number.isInteger(row.price_cents)&&row.price_cents>0&&row.price_cents<100000000&&/^\d{4}-\d{2}-\d{2}$/.test(row.day)&&Number.isFinite(Date.parse(row.observed_at))&&row.day===new Date(row.observed_at).toISOString().slice(0,10)&&Date.parse(row.observed_at)<=Date.now()+60000&&(row.original_cents==null||Number.isInteger(row.original_cents)&&row.original_cents>=row.price_cents&&row.original_cents<100000000)}
async function rest(params,body){let endpoint=url.replace(/\/$/,'')+'/rest/v1/game_price_history?'+new URLSearchParams(params);let response=await fetch(endpoint,{method:body?'POST':'GET',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:body?'resolution=merge-duplicates,return=minimal':'count=none'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(4000)});if(!response.ok)throw Error('Database unavailable');return body?null:await response.json()}
export async function recordSteam(appId,data,observedAt){let p=data?.price_overview;if(data?.type!=='game'||p?.currency!=='BRL'||!Number.isFinite(observedAt)||Date.now()-observedAt>3600000||observedAt>Date.now()+60000)return;let row={app_id:String(appId),store:'Steam Brasil',day:new Date(observedAt).toISOString().slice(0,10),price_cents:p.final,original_cents:Number.isInteger(p.initial)&&p.initial>=p.final&&p.initial<100000000?p.initial:null,observed_at:new Date(observedAt).toISOString()};if(!valid(row))return;let id=row.app_id+'|'+row.day;let old=memory.get(id);if(old&&old.observed_at>row.observed_at)return;memory.set(id,row);while(memory.size>MAX){let oldest=memory.keys().next().value;memory.delete(oldest);dirty.delete(oldest);written.delete(oldest)}if(!configured)return;if(written.get(id)!==signature(row))dirty.add(id);await syncRow(id);await retryPending(id)}
async function syncRow(id){
  if(!configured||Date.now()<retryAt)return;
  if(inflight.has(id))return inflight.get(id);
  if(inflight.size>=4)return;
  const task=(async()=>{try{
    for(let attempt=0;attempt<2;attempt++){
      let row=memory.get(id);if(!row)return;
      let sig=signature(row);
      if(written.get(id)===sig){dirty.delete(id);return}
      await rest({on_conflict:'app_id,store,day'},[row]);
      remoteOk=true;lastSuccess=new Date().toISOString();retryAt=0;
      written.set(id,sig);while(written.size>MAX)written.delete(written.keys().next().value);
      if(memory.get(id)===row){dirty.delete(id);return}
    }
  }catch{remoteOk=false;lastFailure=new Date().toISOString();retryAt=Date.now()+30000}})();
  inflight.set(id,task);try{await task}finally{inflight.delete(id)}
}

async function retryPending(skip){if(!configured||Date.now()<retryAt||inflight.size>=4)return;let ids=[];for(let id of dirty){if(id!==skip&&!inflight.has(id)){ids.push(id);if(ids.length>=4-inflight.size)break}}await Promise.all(ids.map(syncRow))}
export function exportMemoryHistory(){return [...memory.values()].filter(valid).map(r=>({app_id:r.app_id,store:r.store,day:r.day,price_cents:r.price_cents,original_cents:r.original_cents,observed_at:r.observed_at})).sort((a,b)=>a.day.localeCompare(b.day)||a.app_id.localeCompare(b.app_id))}
export async function history(appId,days){let since=new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);let rows=[...memory.values()].filter(r=>r.app_id===appId&&r.day>=since);let storage='memory';if(configured&&Date.now()>=retryAt){try{let remote=await rest({select:'app_id,store,day,price_cents,original_cents,observed_at',app_id:'eq.'+appId,store:'eq.Steam Brasil',day:'gte.'+since,order:'day.asc',limit:String(days)});if(!Array.isArray(remote))throw Error('Invalid history');let merged=new Map();for(let r of [...remote,...rows].filter(valid)){let old=merged.get(r.day);if(!old||old.observed_at<=r.observed_at)merged.set(r.day,r)}rows=[...merged.values()];storage='database';remoteOk=true;lastSuccess=new Date().toISOString();retryAt=0}catch{remoteOk=false;lastFailure=new Date().toISOString();retryAt=Date.now()+30000}}return {storage,days,rows:rows.sort((a,b)=>a.day.localeCompare(b.day))}}
export function historyStatus(){return {configured,available:configured&&remoteOk,storage:configured&&remoteOk?'database':'memory',buffered:memory.size,pendingWrites:dirty.size,inflight:inflight.size,lastSuccess,lastFailure}}
