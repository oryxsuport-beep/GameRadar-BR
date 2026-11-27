import test from 'node:test';
import assert from 'node:assert/strict';
import {acceptsGzip,coalesce} from '../performance.mjs';
test('gzip negotiation honors explicit refusal',()=>{assert.equal(acceptsGzip('gzip, br'),true);assert.equal(acceptsGzip('gzip;q=0, *;q=1'),false);assert.equal(acceptsGzip('br'),false);assert.equal(acceptsGzip('gzip;q=bad'),false);assert.equal(acceptsGzip(undefined),false)});
test('parallel requests share one load and cache expires',async()=>{let time=0,calls=0;const get=coalesce(async()=>++calls,{ttl:30,now:()=>time});assert.deepEqual(await Promise.all([get(),get(),get()]),[1,1,1]);time=31;assert.equal(await get(),2)});
test('failed requests do not cache errors',async()=>{let calls=0;const get=coalesce(async()=>{if(++calls===1)throw Error('unavailable');return calls});await assert.rejects(get());assert.equal(await get(),2)});
