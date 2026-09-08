"""Read the delivered GLB bytes and verify the public editor contract.

Run with Python 3. No third-party library or Blender installation is needed.
This is metadata/geometry evidence; rendered inspection remains separate.
"""
import json, struct, math, hashlib
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
path=ROOT/'public/models/twin.glb'
raw=path.read_bytes()
magic,version,length=struct.unpack_from('<4sII',raw)
assert magic==b'glTF' and version==2 and length==len(raw)
chunks={};pos=12
while pos<len(raw):
    size,typ=struct.unpack_from('<II',raw,pos);pos+=8
    chunks[typ]=raw[pos:pos+size];pos+=size
g=json.loads(chunks[0x4E4F534A]);binary=chunks[0x004E4942]
contract=json.loads((ROOT/'public/models/asset-contract.json').read_text())

def accessor(index):
    a=g['accessors'][index]
    types={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}
    formats={5126:'f',5125:'I',5123:'H',5121:'B',5122:'h',5120:'b'}
    count=types[a['type']];fmt='<'+formats[a['componentType']]*count
    size=struct.calcsize(fmt)
    if 'bufferView' not in a:out=[(0,)*count]*a['count']
    else:
        b=g['bufferViews'][a['bufferView']]
        offset=b.get('byteOffset',0)+a.get('byteOffset',0);stride=b.get('byteStride',size)
        out=[struct.unpack_from(fmt,binary,offset+i*stride) for i in range(a['count'])]
    if 'sparse' in a:
        sparse=a['sparse'];indices=sparse['indices'];values=sparse['values']
        ib=g['bufferViews'][indices['bufferView']];vb=g['bufferViews'][values['bufferView']]
        ifmt='<'+formats[indices['componentType']];isz=struct.calcsize(ifmt)
        io=ib.get('byteOffset',0)+indices.get('byteOffset',0)
        vo=vb.get('byteOffset',0)+values.get('byteOffset',0)
        for k in range(sparse['count']):
            index=struct.unpack_from(ifmt,binary,io+k*isz)[0]
            out[index]=struct.unpack_from(fmt,binary,vo+k*size)
    assert all(math.isfinite(v) for row in out for v in row),f'Nonfinite accessor {index}'
    return out

required=set(contract['morphs']);seen=set();magnitude={n:0 for n in required}
names={n.get('name') for n in g['nodes']}
assert set(contract['hairGroups'])<=names,'Hair parent missing'
mats={m['name'] for m in g['materials']}
assert set(contract['requiredMaterials'])<=mats,'Required material missing'
base_min=[float('inf')]*3;base_max=[-float('inf')]*3
extreme_bounds={label:[[float('inf')]*3,[-float('inf')]*3] for label in ('min','max')}
triangles=0;primitive_count=0
for mesh in g['meshes']:
    target_names=mesh.get('extras',{}).get('targetNames',[])
    assert set(target_names)<=required
    seen.update(target_names)
    assert all(w==0 for w in mesh.get('weights',[])),'Non-neutral exported default'
    for p in mesh['primitives']:
        primitive_count+=1
        assert p.get('mode',4)==4
        triangles+=g['accessors'][p['indices']]['count']//3
        positions=accessor(p['attributes']['POSITION'])
        if 'NORMAL' in p['attributes']:accessor(p['attributes']['NORMAL'])
        for target in p.get('targets',[]):
            if 'NORMAL' in target:accessor(target['NORMAL'])
        targets={n:accessor(t['POSITION']) for n,t in zip(target_names,p.get('targets',[]))}
        for n,delta in targets.items():
            magnitude[n]=max(magnitude[n],max(sum(v*v for v in row)**.5 for row in delta))
        for i,co in enumerate(positions):
            for axis in range(3):
                base_min[axis]=min(base_min[axis],co[axis]);base_max[axis]=max(base_max[axis],co[axis])
            for label in ('min','max'):
                xyz=list(co)
                for n,delta in targets.items():
                    val=contract['morphs'][n]['min' if label=='min' else 'max']
                    for axis in range(3):xyz[axis]+=delta[i][axis]*val
                assert all(math.isfinite(v) for v in xyz)
                for axis in range(3):
                    extreme_bounds[label][0][axis]=min(extreme_bounds[label][0][axis],xyz[axis])
                    extreme_bounds[label][1][axis]=max(extreme_bounds[label][1][axis],xyz[axis])
assert seen==required,f'Missing morphs: {required-seen}'
assert all(magnitude[n]>.0001 for n in required),'A target has no real geometry'
assert abs(base_min[1])<1e-5,'Feet are not at Y=0'
assert 1.65<base_max[1]<1.85,'Unexpected character height'
assert max(contract['visibleTrianglesByHair'].values())<=200000,'Visible triangle budget exceeded'
assert len(raw)<15*1024*1024,'GLB byte budget exceeded'
assert not g.get('animations') and not g.get('skins')
assert not any('KHR_draco_mesh_compression' in p.get('extensions',{}) for m in g['meshes'] for p in m['primitives'])
report={'status':'PASS','glbSha256':hashlib.sha256(raw).hexdigest(),'glbBytes':len(raw),'glbMiB':round(len(raw)/1024**2,2),
 'meshCount':len(g['meshes']),'primitiveCount':primitive_count,'allVariantsTriangles':triangles,
 'visibleTrianglesByHair':contract['visibleTrianglesByHair'],'baseBoundsYUp':[base_min,base_max],
 'simultaneousExtremesBoundsYUp':extreme_bounds,'morphMaximumDisplacementsMetres':magnitude,
 'hairGroups':contract['hairGroups'],'requiredMaterialsVerified':contract['requiredMaterials'],
 'morphNamesVerified':sorted(seen),'visualEvidence':['twin-fullbody.png','twin-face.png','twin-face-min.png','twin-face-max.png','twin-body-max.png','Hair_Crop.png','Hair_Bob.png','Hair_Long.png']}
(ROOT/'blender/validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
