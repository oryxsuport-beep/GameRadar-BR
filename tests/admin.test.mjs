import test from 'node:test';
import assert from 'node:assert/strict';
import {adminConfigured,adminAuthorized,adminPage} from '../admin.mjs';
import {makeVisitCounter} from '../analytics.mjs';
test('admin is disabled without a strong configured password',()=>{assert.equal(adminConfigured(undefined),false);assert.equal(adminConfigured('short'),false);assert.equal(adminAuthorized('Basic Zm9v',''),false)});
test('admin requires exact Basic credentials',()=>{const p='a'.repeat(32),auth=s=>'Basic '+Buffer.from(s).toString('base64');assert.equal(adminAuthorized(auth('admin:'+p),p),true);assert.equal(adminAuthorized(auth('admin:wrong'),p),false);assert.equal(adminAuthorized(auth('guest:'+p),p),false);assert.equal(adminAuthorized(undefined,p),false)});
test('counter rolls over daily and limits accepted events',()=>{let n=0,c=makeVisitCounter({now:()=>n,log:()=>{},maxPerMinute:2});assert.equal(c(),true);assert.equal(c(),true);assert.equal(c(),false);n=86400000;assert.equal(c.snapshot().today,0);assert.equal(c(),true);assert.equal(c.snapshot().total,3)});
test('dashboard escapes source names',()=>{const html=adminPage({days:[],today:0,total:0,startedAt:'now'},{},{'<script>':{status:'ok',at:'now'}});assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'))});
