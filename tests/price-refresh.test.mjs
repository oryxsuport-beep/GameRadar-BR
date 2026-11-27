import test from 'node:test';
import assert from 'node:assert/strict';
import {makePriceRefresh} from '../price-refresh.mjs';
test('refresh cycles deduplicate overlapping calls and record failures',async()=>{let calls=0;let r=makePriceRefresh([{name:'ok',load:async()=>++calls},{name:'bad',load:()=>{throw Error('unavailable')}}],{now:()=>0});await Promise.all([r.run(),r.run()]);assert.equal(calls,1);assert.equal(r.snapshot().runs,1);assert.equal(r.snapshot().results.ok.count,1);assert.equal(r.snapshot().results.bad.ok,false);assert.equal(r.snapshot().running,false);await r.run();assert.equal(calls,2)});
