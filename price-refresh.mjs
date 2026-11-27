// A bounded, non-overlapping refresh cycle. No external keep-alive requests.
export function makePriceRefresh(tasks,{now=Date.now,intervalMs=600000}={}){
 let pending=null,lastAttempt=null,lastCompleted=null,results={},runs=0;
 const stamp=()=>new Date(now()).toISOString();
 async function run(){
  if(pending)return pending;
  lastAttempt=stamp();
  const task=Promise.resolve().then(async()=>{
   const settled=await Promise.allSettled(tasks.map(t=>Promise.resolve().then(t.load)));
   results=Object.fromEntries(tasks.map((t,i)=>[t.name,settled[i].status==='fulfilled'?{ok:true,count:Number.isInteger(settled[i].value)?settled[i].value:null}:{ok:false,count:null}]));
   lastCompleted=stamp();runs++;
   return snapshot();
  });
  pending=task;try{return await task}finally{if(pending===task)pending=null}
 }
 function snapshot(){return {intervalSeconds:intervalMs/1000,running:!!pending,lastAttempt,lastCompleted,runs,results:{...results}}}
 return {run,snapshot};
}
