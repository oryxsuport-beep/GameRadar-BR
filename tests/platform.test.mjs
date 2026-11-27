import test from 'node:test';
import assert from 'node:assert/strict';
import {manifest,iconPNG,makeLimiter,routeCost,offlineHTML} from '../platform.mjs';
test('manifest and PNG icons have matching sizes',()=>{assert.equal(manifest.display,'standalone');for(const icon of manifest.icons){const size=Number(icon.sizes.split('x')[0]),png=iconPNG(size);assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size)}});
test('request limiter resets and bounds keys',()=>{const allow=makeLimiter({windowMs:1000,max:2,capacity:2});assert.equal(allow('a',0).ok,true);assert.equal(allow('a',1).ok,true);assert.equal(allow('a',2).ok,false);assert.equal(allow('b',2).ok,true);assert.equal(allow('c',2).ok,false);assert.equal(allow('a',1000).ok,true)});
test('heavy routes and offline page',()=>{assert.equal(routeCost('/api/search'),'heavy');assert.equal(routeCost('/api/status'),'normal');assert.match(offlineHTML,/offline/i)});
