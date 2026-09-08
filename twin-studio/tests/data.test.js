import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CONFIG, validateConfig } from '../src/state.js';
import { estimateFeatures } from '../src/measurements.js';
import { analyzePhoto } from '../src/photo.js';

test('design files accept editable values and discard unrelated data', () => {
  const input = structuredClone(DEFAULT_CONFIG);
  input.shape.FaceWidth = -1; input.shape.Smile = 1;
  input.photo = 'private-image'; input.landmarks = [{x: 1}];
  const output = validateConfig(input);
  assert.equal(output.shape.FaceWidth, -1);
  assert.equal('photo' in output, false);
  assert.equal('landmarks' in output, false);
  output.shape.FaceWidth = 0;
  assert.equal(input.shape.FaceWidth, -1);
});
test('invalid or oversized design values cannot reach the renderer', () => {
  for (const change of [x=>x.version=2,x=>x.height=Infinity,x=>x.shape.Smile=-1,x=>x.shape.EyeSize=1.1,x=>x.name='x'.repeat(41),x=>x.skin='url(evil)',x=>x.hair='unknown']) {
    const input = structuredClone(DEFAULT_CONFIG); change(input);
    assert.throws(() => validateConfig(input));
  }
});
test('photo validation rejects unsupported and oversized files before decode', async () => {
  await assert.rejects(analyzePhoto({type:'image/svg+xml',size:1}), /JPG/);
  await assert.rejects(analyzePhoto({type:'image/jpeg',size:13*1024*1024}), /12 MB/);
});
test('landmark estimator rejects missing, tiny, and non-finite measurements', () => {
  assert.throws(() => estimateFeatures([], 100, 100), /measured/);
  const points = Array.from({length:478},()=>({x:.5,y:.5}));
  assert.throws(() => estimateFeatures(points, 100, 100), /too small/);
  points[234].x = NaN;
  assert.throws(() => estimateFeatures(points, 100, 100), /measured/);
});
