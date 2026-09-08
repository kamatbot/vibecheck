import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SHAPES } from '../src/state.js';

test('Blender asset is a complete binary glTF with real editable geometry', () => {
  const bytes = fs.readFileSync(new URL('../public/models/twin.glb', import.meta.url));
  const contract = JSON.parse(fs.readFileSync(new URL('../public/models/asset-contract.json', import.meta.url)));
  assert.equal(bytes.readUInt32LE(0), 0x46546c67);
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  const jsonLength = bytes.readUInt32LE(12);
  const gltf = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString());
  const binaryStart = 20 + jsonLength + 8;
  for (const name of contract.requiredMaterials) assert.ok(gltf.materials.some(m => m.name === name), `Missing material ${name}`);
  for (const name of contract.hairGroups) assert.ok(gltf.nodes.some(n => n.name === name), `Missing hair ${name}`);
  const changing = new Set();
  for (const mesh of gltf.meshes) for (const primitive of mesh.primitives) {
    for (const [index, target] of (primitive.targets || []).entries()) {
      const accessor = gltf.accessors[target.POSITION];
      if (!accessor || accessor.componentType !== 5126 || accessor.type !== 'VEC3') continue;
      let moves = false;
      const regions = [];
      if (accessor.bufferView !== undefined) regions.push({view: accessor.bufferView, offset: accessor.byteOffset, count: accessor.count});
      // Blender stores sparse morphs without a base view: omitted values are zero.
      if (accessor.sparse) regions.push({view: accessor.sparse.values.bufferView, offset: accessor.sparse.values.byteOffset, count: accessor.sparse.count});
      for (const region of regions) {
        const bufferView = gltf.bufferViews[region.view];
        const start = binaryStart + (bufferView.byteOffset || 0) + (region.offset || 0);
        for (let point = 0; point < region.count; point++) for (let axis = 0; axis < 3; axis++) {
          const value = bytes.readFloatLE(start + point * (bufferView.byteStride || 12) + axis * 4);
          assert.ok(Number.isFinite(value), 'Non-finite morph displacement');
          if (Math.abs(value) > 1e-7) moves = true;
        }
      }
      if (moves) changing.add(mesh.extras?.targetNames?.[index]);
    }
  }
  for (const name of SHAPES) assert.ok(changing.has(name), `No real geometry change for ${name}`);
  assert.equal(contract.glbBytes, bytes.length);
});
