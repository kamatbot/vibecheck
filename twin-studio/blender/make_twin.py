"""Twin Studio — original, editable stylized character.

Rebuild with Blender 5.2:
  /Applications/Blender.app/Contents/MacOS/Blender -b --python blender/make_twin.py

All geometry is authored here; no external asset or texture is used. Blender is
Z-up, facing -Y. The glTF exporter converts to Y-up, facing +Z. The head and hair are implicit
sculpts (numpy signed-distance fields meshed through the bundled OpenVDB); linear
shape keys expose conservative, combinable editorial changes. The .blend retains the editable meshes and shape-key library.
"""
import bpy, math, os, json, random
from mathutils import Vector
from math import sin, cos, pi, sqrt, exp

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'models')
ART = os.path.join(ROOT, 'blender')
os.makedirs(OUT, exist_ok=True)
random.seed(14)
bpy.ops.wm.read_factory_settings(use_empty=True)
S = bpy.context.scene
CHAR = bpy.data.collections.new('TWIN — editable character')
S.collection.children.link(CHAR)
STUDIO = bpy.data.collections.new('STUDIO — excluded from GLB')
S.collection.children.link(STUDIO)
M = {}
OWN = []
HAIR = {}
MORPHS = ['FaceWidth','JawWidth','NoseWidth','NoseLength','EyeSize','EyeSpacing','LipFullness','Smile','BodyShape']

def hexlin(h):
    def lin(x): return x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4
    return tuple(lin(int(h[i:i+2],16) / 255) for i in (0,2,4))

def material(name, color, rough=.5, metallic=0, subsurface=0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*hexlin(color),1)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Subsurface Weight'].default_value = subsurface
    p.inputs['Subsurface Radius'].default_value = (1,.4,.2)
    m.diffuse_color = (*hexlin(color),1)
    M[name] = m
    return m

material('Skin','c98f72',.53,subsurface=.07)
material('Lips','a9655d',.53,subsurface=.03)
material('Hair','32231e',.59)
material('Brows','362722',.7)
material('Iris','658878',.34)
material('Sclera','f0e7db',.26)
material('Top','487780',.86)
material('Pants','bcb3a2',.88)
material('Shoes','eee7d9',.62)
material('Sole','d7cfbd',.82)
material('Pupil','131c1d',.26)
material('Catchlight','fff8eb',.18)
material('MouthCrease','693e37',.75)
material('Nostril','754b40',.72)
material('Iris_Rim','365953',.38)
material('Iris_Inner','96926a',.37)
material('Iris_Fiber','83a08b',.4)
material('Top_Seam','416b73',.87)
material('Pants_Seam','a69b87',.88)
material('Shoe_Panel','c7bdac',.74)
material('Shoe_Eyelet','a19989',.4,metallic=.3)
material('Nails','d7a38b',.43)

def link_obj(o, collection=CHAR):
    for c in list(o.users_collection): c.objects.unlink(o)
    collection.objects.link(o)
    return o

def mesh(name, verts, faces, mat, part='body', parent=None):
    me = bpy.data.meshes.new(name + ' — surface')
    me.from_pydata(verts, [], faces)
    me.update()
    o = bpy.data.objects.new(name,me)
    CHAR.objects.link(o)
    if isinstance(mat,str): mat=M[mat]
    me.materials.append(mat)
    for p in me.polygons: p.use_smooth=True
    o['part'] = part
    if parent: o.parent=parent
    OWN.append(o)
    return o

def apply_mod(o, mod):
    bpy.context.view_layer.objects.active=o
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True)
    bpy.ops.object.modifier_apply(modifier=mod.name)
    o.select_set(False)

def bake(o):
    bpy.context.view_layer.objects.active=o
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    o.select_set(False)
    return o

def ellipsoid(name, center, scale, mat, part='body', seg=32, rings=20, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=rings,radius=1,location=center)
    o=bpy.context.object;o.name=name;o.scale=scale
    link_obj(o);o.data.materials.append(M[mat]);bake(o)
    for p in o.data.polygons:p.use_smooth=True
    o['part']=part
    if parent:o.parent=parent
    OWN.append(o)
    return o

def catmull(points, steps=8):
    pts=[Vector(p) for p in points]
    out=[]
    for i in range(len(pts)-1):
        a=pts[max(0,i-1)];b=pts[i];c=pts[i+1];d=pts[min(len(pts)-1,i+2)]
        for k in range(steps):
            t=k/steps
            out.append(.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
    out.append(pts[-1])
    return out

def tube(name, points, radius, mat, part='body', radii=None, resolution=5, sides=8, parent=None, flat=1):
    path=catmull(points,resolution)
    verts=[];faces=[]
    for i,c in enumerate(path):
        t=i/(len(path)-1)
        tangent=(path[min(i+1,len(path)-1)]-path[max(i-1,0)]).normalized()
        ref=Vector((0,1,0))
        if abs(tangent.dot(ref))>.94:ref=Vector((1,0,0))
        u=tangent.cross(ref).normalized();v=tangent.cross(u).normalized()
        if radii:
            f=t*(len(radii)-1);j=min(int(f),len(radii)-2);rr=radii[j]*(1-(f-j))+radii[j+1]*(f-j)
        else:rr=1
        for a in range(sides):
            th=2*pi*a/sides
            verts.append(tuple(c+radius*rr*(u*cos(th)+v*sin(th)*flat)))
    for j in range(len(path)-1):
        for i in range(sides):
            a=j*sides+i;b=j*sides+(i+1)%sides
            faces.append((a,b,b+sides,a+sides))
    faces += [tuple(reversed(range(sides))),tuple((len(path)-1)*sides+i for i in range(sides))]
    return mesh(name,verts,faces,mat,part,parent)

def loft(name,rings,mat,part='body',sides=48,sub=1, parent=None):
    verts=[];faces=[]
    for x,y,z,rx,ry in rings:
        for i in range(sides):
            a=i*2*pi/sides
            verts.append((x+rx*cos(a),y+ry*sin(a),z))
    for j in range(len(rings)-1):
        for i in range(sides):
            a=j*sides+i;b=j*sides+(i+1)%sides
            faces.append((a,b,b+sides,a+sides))
    faces += [tuple(reversed(range(sides))),tuple((len(rings)-1)*sides+i for i in range(sides))]
    o=mesh(name,verts,faces,mat,part,parent)
    if sub:
        m=o.modifiers.new('Soft tailored surface','SUBSURF');m.levels=sub;apply_mod(o,m)
    return o

def remesh_join(parts,name,voxel,smooth=3):
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0]
    bpy.ops.object.join();o=parts[0];o.name=name
    for q in parts[1:]:
        if q in OWN:OWN.remove(q)
    m=o.modifiers.new('Continuous sculpt union','REMESH');m.mode='VOXEL';m.voxel_size=voxel;m.use_smooth_shade=True;apply_mod(o,m)
    m=o.modifiers.new('Sculpt polish','SMOOTH');m.factor=.72;m.iterations=smooth;apply_mod(o,m)
    return o

def interp(table,z):
    if z<=table[0][0]:return table[0][1:]
    if z>=table[-1][0]:return table[-1][1:]
    for i in range(len(table)-1):
        if table[i][0]<=z<=table[i+1][0]:
            h=table[i+1][0]-table[i][0];t=(z-table[i][0])/h
            # Cubic Hermite interpolation shares nonzero tangents at adjacent
            # anatomical sections; smoothstep would scallop the silhouette.
            before=table[max(0,i-1)];after=table[min(len(table)-1,i+2)]
            vals=[]
            for j in range(1,len(table[i])):
                m0=(table[i+1][j]-before[j])/(table[i+1][0]-before[0])
                m1=(after[j]-table[i][j])/(after[0]-table[i][0])
                vals.append((2*t**3-3*t*t+1)*table[i][j]+(t**3-2*t*t+t)*h*m0+(-2*t**3+3*t*t)*table[i+1][j]+(t**3-t*t)*h*m1)
            return tuple(vals)

def gauss(x,z,cx,cz,sx,sz):return exp(-((x-cx)/sx)**2-((z-cz)/sz)**2)
def clamp(x,a=0,b=1):return min(b,max(a,x))
def smooth(a,b,x):
    t=clamp((x-a)/(b-a));return t*t*(3-2*t)

# Head: an implicit sculpt. Anatomical volumes (cranium, frontal bone, cheek and
# zygomatic masses, mandible, chin, nose, lips, lids, ears, brows) are signed
# distance primitives blended with smooth minimums, carved for the sockets,
# nostrils, mouth seam and eye openings, then meshed through OpenVDB. Overhangs
# such as the nose tip, lips, brow and lids are real volumes, not a height field.
import numpy as np, openvdb as vdb, tempfile, bmesh
TMP=tempfile.mkdtemp()

class Grid:
    def __init__(self,lo,hi,h):
        self.h=h;self.axes=[np.arange(a,b+h/2,h,dtype=np.float32) for a,b in zip(lo,hi)]
        self.X,self.Y,self.Z=np.meshgrid(*self.axes,indexing='ij');self.P=(self.X,self.Y,self.Z)
        self.origin=np.array([self.axes[0][0],self.axes[1][0],self.axes[2][0]],dtype=np.float32)
    def surface_y(self,field,x,z):
        # Front-most zero crossing of a sampled column places surface details.
        i=int(round((x-self.axes[0][0])/self.h));k=int(round((z-self.axes[2][0])/self.h))
        col=field[i,:,k];j=int(np.argmax(col<=0))
        if j==0:return float(self.axes[1][0])
        a,b=float(col[j-1]),float(col[j]);return float(self.axes[1][j-1])+self.h*a/(a-b)
    def surface(self,field,name,mat,part,parent=None,adaptivity=.08):
        g=vdb.FloatGrid();g.copyFromArray(np.ascontiguousarray(np.clip(field,-.03,.03),dtype=np.float32))
        g.gridClass=vdb.GridClass.LEVEL_SET;g.name='sdf';g.transform=vdb.createLinearTransform(voxelSize=self.h)
        path=os.path.join(TMP,name+'_grid.vdb');vdb.write(path,grids=[g])
        bpy.ops.object.volume_import(filepath=path,align='WORLD');vol=bpy.context.object
        me=bpy.data.meshes.new(name+' — surface');o=bpy.data.objects.new(name,me);CHAR.objects.link(o)
        m=o.modifiers.new('Level set surface','VOLUME_TO_MESH');m.object=vol;m.grid_name='sdf';m.threshold=0
        m.adaptivity=adaptivity;m.resolution_mode='VOXEL_SIZE';m.voxel_size=self.h;apply_mod(o,m)
        co=np.empty(len(me.vertices)*3,dtype=np.float32);me.vertices.foreach_get('co',co)
        me.vertices.foreach_set('co',(co.reshape(-1,3)+self.origin).ravel())
        data=vol.data;bpy.data.objects.remove(vol);bpy.data.volumes.remove(data);os.remove(path)
        me.materials.append(M[mat] if isinstance(mat,str) else mat)
        for p in me.polygons:p.use_smooth=True
        o['part']=part
        if parent:o.parent=parent
        OWN.append(o);return o

def centers(o):
    c=np.empty(len(o.data.polygons)*3,dtype=np.float32);o.data.polygons.foreach_get('center',c);c=c.reshape(-1,3)
    return (c[:,0],c[:,1],c[:,2])
def polish(o,target,iterations=2):
    m=o.modifiers.new('Level set polish','SMOOTH');m.factor=.5;m.iterations=iterations;apply_mod(o,m)
    tris=sum(len(p.vertices)-2 for p in o.data.polygons)
    if tris>target:
        m=o.modifiers.new('Sculpt topology economy','DECIMATE');m.ratio=target/tris;apply_mod(o,m)

def sstep(a,b,x):
    t=np.clip((x-a)/(b-a),0,1);return t*t*(3-2*t)
def smin(a,b,k):
    h=np.clip(.5+.5*(b-a)/k,0,1);return b+(a-b)*h-k*h*(1-h)
def ssub(a,b,k):return -smin(-a,b,k)
def smax(a,b,k):return -smin(-a,-b,k)
def sphere(P,c,r):X,Y,Z=P;return np.sqrt((X-c[0])**2+(Y-c[1])**2+(Z-c[2])**2)-r
def ell(P,c,r):
    X,Y,Z=P;px=(X-c[0])/r[0];py=(Y-c[1])/r[1];pz=(Z-c[2])/r[2]
    k0=np.sqrt(px*px+py*py+pz*pz);k1=np.sqrt((px/r[0])**2+(py/r[1])**2+(pz/r[2])**2)
    return k0*(k0-1)/np.maximum(k1,1e-6)
def cap(P,a,b,r0,r1=None):
    X,Y,Z=P;r1=r0 if r1 is None else r1
    ax,ay,az=X-a[0],Y-a[1],Z-a[2];bx,by,bz=b[0]-a[0],b[1]-a[1],b[2]-a[2]
    t=np.clip((ax*bx+ay*by+az*bz)/(bx*bx+by*by+bz*bz),0,1)
    return np.sqrt((ax-bx*t)**2+(ay-by*t)**2+(az-bz*t)**2)-(r0+(r1-r0)*t)
def chain(P,pts,radii,k=.004):
    d=None
    for i in range(len(pts)-1):
        c=cap(P,pts[i],pts[i+1],radii[i],radii[i+1]);d=c if d is None else smin(d,c,k)
    return d
def mirrored(half):return half+[(-x,y,z) for x,y,z in half[-2::-1]]

EYE_Z=1.556;EYE_X=.046;EYE_Y=-.052;EYE_R=.0295;EYE_W=.0265
MOUTH_Z=1.462;MOUTH_W=.037
def mouthline(x):return MOUTH_Z+.0035*(abs(x)/MOUTH_W)**2
def lid_up(s,dx):
    f=np.sqrt(np.clip(1-(dx/EYE_W)**2,0,None));return .0125*f**.8*(1-.12*s*dx/EYE_W)
def lid_down(s,dx):
    f=np.sqrt(np.clip(1-(dx/EYE_W)**2,0,None));return .0085*f**.7*(1+.15*s*dx/EYE_W)
def lid_tilt(s,dx):return s*dx*.07+.001
def opening(P,s):
    X,Y,Z=P;dx=X-s*EYE_X;dz=Z-EYE_Z-lid_tilt(s,dx)
    d=np.maximum(np.maximum(dz-lid_up(s,dx),-dz-lid_down(s,dx)),np.abs(dx)-EYE_W)
    return np.maximum(d,Y-(EYE_Y+.002))

LIP_UPPER=mirrored([(-.037,-.089,MOUTH_Z+.0045),(-.024,-.101,MOUTH_Z+.0065),(-.0085,-.108,MOUTH_Z+.0075),(0,-.1068,MOUTH_Z+.0068)])
LIP_UPPER_R=[.0030,.0052,.0056,.0054,.0056,.0052,.0030]
LIP_LOWER=mirrored([(-.036,-.089,MOUTH_Z+.0025),(-.021,-.102,MOUTH_Z-.0058),(0,-.1065,MOUTH_Z-.0075)])
LIP_LOWER_R=[.0030,.0062,.0066,.0062,.0030]
SEAM=mirrored([(-.037,0,mouthline(.037)),(-.020,0,mouthline(.020)),(0,0,MOUTH_Z)])
def lips(P):return smin(chain(P,LIP_UPPER,LIP_UPPER_R),chain(P,LIP_LOWER,LIP_LOWER_R),.003)
def seam(P):
    X,Y,Z=P;flat=(X,np.zeros_like(Y),Z)
    return np.maximum(chain(flat,SEAM,[.0011]*len(SEAM),.001),np.abs(Y+.104)-.010)
def nostrils(P):
    return np.minimum(*[ell(P,(s*.0095,-.109,1.4915),(.0046,.0055,.0034)) for s in (-1,1)])

def sdf_skull(P):
    d=ell(P,(0,.020,1.598),(.104,.110,.108))                       # cranium
    d=smin(d,ell(P,(0,-.040,1.628),(.088,.062,.078)),.03)           # frontal bone
    d=smin(d,ell(P,(0,.030,1.560),(.106,.100,.085)),.03)            # temporal width
    for s in (-1,1):d=smin(d,ell(P,(s*.113,.014,1.540),(.009,.020,.032)),.008)  # ear plates
    return d

def sdf_head(P):
    d=sdf_skull(P)
    d=smin(d,cap(P,(0,.025,1.40),(0,.025,1.50),.050),.025)          # under-jaw core to neck
    for s in (-1,1):
        d=smin(d,ell(P,(s*.049,-.038,1.512),(.061,.056,.056)),.030)  # cheek mass
        d=smin(d,ell(P,(s*.074,-.030,1.540),(.026,.034,.024)),.022)  # zygomatic
        d=smin(d,ell(P,(s*.054,-.046,1.468),(.038,.036,.036)),.026)  # buccal fullness
        d=smin(d,cap(P,(s*.092,.032,1.515),(s*.075,.012,1.442),.019),.018)   # ramus
        d=smin(d,cap(P,(s*.075,.012,1.442),(s*.026,-.078,1.408),.018),.020)  # mandible
        d=smin(d,cap(P,(0,-.088,1.593),(s*.056,-.078,1.598),.012),.014)      # brow ridge
    d=smin(d,ell(P,(0,-.052,1.497),(.044,.050,.040)),.02)           # maxilla
    d=smin(d,ell(P,(0,-.048,1.468),(.058,.054,.044)),.02)           # muzzle
    d=smin(d,ell(P,(0,-.072,1.412),(.036,.030,.026)),.018)          # chin
    for s in (-1,1):d=ssub(d,ell(P,(s*.047,-.064,1.563),(.034,.030,.026)),.012)  # orbits
    for s in (-1,1):d=smin(d,sphere(P,(s*EYE_X,EYE_Y,EYE_Z),EYE_R+.0030),.010)   # lids
    n=cap(P,(0,-.094,1.572),(0,-.126,1.511),.0095,.0118)            # dorsum
    n=smin(n,sphere(P,(0,-.127,1.507),.0145),.008)                  # tip
    for s in (-1,1):n=smin(n,ell(P,(s*.0175,-.111,1.503),(.0125,.012,.0105)),.007)  # alae
    n=smin(n,cap(P,(0,-.124,1.496),(0,-.106,1.492),.0055),.006)     # columella
    d=smin(d,n,.012)
    d=ssub(d,nostrils(P),.002)
    d=smin(d,lips(P),.006)
    d=ssub(d,seam(P),.0012)
    for s in (-1,1):d=ssub(d,opening(P,s),.0008)
    for s in (-1,1):                                                # ears
        d=ssub(d,ell(P,(s*.121,.013,1.536),(.009,.013,.019)),.003)  # concha bowl
        rim=[(s*.113,-.002,1.560),(s*.118,.010,1.574),(s*.121,.028,1.563),(s*.1225,.035,1.540),(s*.120,.030,1.515),(s*.114,.016,1.499)]
        d=smin(d,chain(P,rim,[.0034,.0040,.0042,.0042,.0038,.0034],.003),.003)  # helix
        d=smin(d,chain(P,[(s*.117,.021,1.514),(s*.1195,.022,1.542),(s*.117,.012,1.560)],[.0026,.0032,.0026],.003),.0025)  # antihelix
        d=smin(d,ell(P,(s*.110,-.005,1.536),(.005,.006,.008)),.004)  # tragus
        d=smin(d,ell(P,(s*.113,.015,1.503),(.007,.011,.009)),.008)   # lobe
    return d

G=Grid((-.136,-.156,1.368),(.136,.140,1.716),.0015)
field=sdf_head(G.P)
head=G.surface(field,'Head_Sculpt','Skin','head')
polish(head,42000)
for key in ('Lips','MouthCrease','Nostril'):head.data.materials.append(M[key])
C=centers(head);idx=np.zeros(len(head.data.polygons),dtype=np.int32)
idx[lips(C)<.0009]=1;idx[seam(C)<.0007]=2;idx[nostrils(C)<.0006]=3
head.data.polygons.foreach_set('material_index',idx)
# Tapered brow ribbons follow the sampled forehead surface.
for s in (-1,1):
    pts=[]
    for i in range(11):
        t=i/10;xx=s*(.018+.056*t);zz=1.599+.010*sin(pi*t)-.001*t
        pts.append((xx,G.surface_y(field,xx,zz)-.0022,zz))
    tube('Brow_'+('L' if s<0 else 'R'),pts,.0040,'Brows','brow_'+('L' if s<0 else 'R'),radii=[.45,.9,1,.95,.72,.12],resolution=3,sides=8,flat=.55)
del field

# Neck has trapezius flare beneath the crew neck and a proper under-chin join.
loft('Neck',[(0,.022,1.284,.075,.060),(0,.022,1.323,.060,.047),
 (0,.021,1.366,.042,.040),(0,.022,1.414,.045,.038),(0,.024,1.443,.050,.041)],'Skin','neck',40,1)

# Eyeballs are real spheres set behind the sculpted lids: sclera, a raised
# cornea carrying a concentric iris with radial fibres, pupil and limbal ring.
for s in (-1,1):
    sn='L' if s<0 else 'R';part='eye_'+sn;c=Vector((s*EYE_X,EYE_Y,EYE_Z))
    IR=math.radians(26);phis=[IR*(i/12)**1.15 for i in range(1,13)]+[IR+(pi-IR)*i/16 for i in range(1,17)]
    seg=48;vv=[tuple(c+Vector((0,-EYE_R-.0006,0)))];ff=[]
    for ph in phis:
        bulge=.0006*max(0,cos(ph/IR*pi/2)) if ph<IR else 0
        for i in range(seg):
            th=2*pi*i/seg;dirv=Vector((sin(ph)*cos(th),-cos(ph),sin(ph)*sin(th)))
            vv.append(tuple(c+dirv*(EYE_R+bulge)))
    for i in range(seg):ff.append((0,1+(i+1)%seg,1+i))
    for j in range(len(phis)-1):
        for i in range(seg):
            a=1+j*seg+i;b=1+j*seg+(i+1)%seg;ff.append((a,a+seg,b+seg,b))
    eye=mesh('Eyeball_'+sn,vv,ff,'Sclera',part)
    for key in ('Pupil','Iris_Inner','Iris','Iris_Fiber','Iris_Rim'):eye.data.materials.append(M[key])
    bounds=[math.radians(a) for a in (8.5,12,22.5,26)]
    for p in eye.data.polygons:
        ring=0 if p.index<seg else 1+(p.index-seg)//seg
        mid=(phis[ring-1] if ring else 0)+(phis[ring]-(phis[ring-1] if ring else 0))/2 if ring<len(phis) else pi
        p.material_index=1 if mid<bounds[0] else 2 if mid<bounds[1] else (4 if p.index%5==0 else 3) if mid<bounds[2] else 5 if mid<bounds[3] else 0
    for j,(dx,dz,r) in enumerate([(-.0034,.0052,.0026),(.0040,-.0036,.0010)]):
        dirv=Vector((dx,-EYE_R,dz)).normalized()
        ellipsoid('Eye_Glint_'+sn+'_'+str(j),tuple(c+dirv*(EYE_R+.0009)),(r,.0005,r),'Catchlight',part,20,12)
    # A fine lash line along the sculpted upper lid edge reads at portrait scale.
    pts=[]
    for t in range(13):
        dx=-EYE_W*cos(pi*t/12);dz=float(lid_up(s,dx))+lid_tilt(s,dx)
        pts.append((s*EYE_X+dx,EYE_Y-sqrt(max(1e-6,EYE_R**2-dx*dx-dz*dz))-.0016,EYE_Z+dz))
    tube('Lash_Line_'+sn,pts,.0009,'Brows',part,radii=[.1,.7,1,1,.85,.5,.1],resolution=2,sides=6)

# A softly structured long-sleeved crew neck. Subtle folds are part of the
# garment mesh, with real ribbed bands and topstitched raglan construction.
bodyrings=[(0,.014,.895,.137,.082),(0,.014,.902,.144,.086),(0,.013,.927,.147,.088),
 (0,.010,.960,.144,.086),(0,.008,1.010,.143,.085),(0,.006,1.060,.148,.089),
 (0,.004,1.115,.160,.096),(0,.006,1.170,.179,.102),(0,.009,1.220,.193,.099),
 (0,.012,1.265,.196,.092),(0,.016,1.296,.179,.080),(0,.020,1.322,.132,.065),
 (0,.020,1.337,.074,.052),(0,.020,1.338,.055,.041)]
torso=loft('Crewneck_Torso',bodyrings,'Top',sides=56,sub=1)
arms=[]
ARM={-1:[(-.130,.013,1.279),(-.207,.003,1.231),(-.249,-.005,1.125),(-.258,-.015,1.053),(-.266,-.018,.977)],
      1:[(.130,.013,1.279),(.212,.017,1.233),(.260,.030,1.143),(.278,.017,1.075),(.285,-.003,1.010)]}
for side in (-1,1):
    pts=catmull(ARM[side],8);vv=[];ff=[];ns=40
    for j,c in enumerate(pts):
        t=j/(len(pts)-1);tan=(pts[min(j+1,len(pts)-1)]-pts[max(0,j-1)]).normalized()
        u=tan.cross(Vector((0,1,0))).normalized();v=tan.cross(u).normalized()
        r=(.077*(1-t)+.045*t)*(.57+.43*smooth(0,.21,t))
        for i in range(ns):
            a=i*2*pi/ns
            wrinkle=.0018*sin(28*t+3*a)*exp(-((t-.67)/.28)**2)+.0012*sin(52*t-2*a)*exp(-((t-.86)/.15)**2)
            vv.append(tuple(c+(r+wrinkle)*(u*cos(a)+v*sin(a)*.88)))
    for j in range(len(pts)-1):
        for i in range(ns):
            a=j*ns+i;b=j*ns+(i+1)%ns;ff.append((a,b,b+ns,a+ns))
    ff += [tuple(reversed(range(ns))),tuple((len(pts)-1)*ns+i for i in range(ns))]
    arms.append(mesh('Sleeve_'+str(side),vv,ff,'Top'))
top=remesh_join([torso]+arms,'Top_Continuous_Garment',.0042,4)
m=top.modifiers.new('Cloth topology economy','DECIMATE');m.ratio=.32;apply_mod(top,m)

# Ribbed neck opening and hem: surface rings keep fabric tangent at the edge.
def band(name,cx,cy,z,rx,ry,height,mat,part='body',rib=64):
    vv=[];ff=[];ns=rib*2
    for j,(zz,f) in enumerate([(z-height/2,.99),(z-height*.4,1.01),(z+height*.4,1.01),(z+height/2,.99)]):
        for i in range(ns):
            a=2*pi*i/ns;ripple=.00065*(1 if i%2 else -1)
            vv.append((cx+(rx*f+ripple)*cos(a),cy+(ry*f+ripple)*sin(a),zz))
    for j in range(3):
        for i in range(ns):
            a=j*ns+i;b=j*ns+(i+1)%ns;ff.append((a,b,b+ns,a+ns))
    return mesh(name,vv,ff,mat,part)
band('Crewneck_Rib_Collar',0,.019,1.338,.058,.044,.019,'Top',rib=52)
band('Crewneck_Rib_Hem',0,.014,.905,.143,.087,.025,'Top',rib=96)
for side in (-1,1):
    wr=Vector(ARM[side][-1]);band('Sleeve_Rib_Cuff_'+str(side),wr.x,wr.y,wr.z+.005,.045,.039,.030,'Top',rib=40)
    # Raglan seam arcs read as construction details, not decorative piping.
    pts=[(side*.052,-.018,1.332),(side*.093,-.051,1.301),(side*.140,-.066,1.260),(side*.182,-.063,1.203)]
    tube('Raglan_Seam_'+str(side),pts,.0011,'Top_Seam',radii=[.4,.8,1,.4],resolution=6,sides=6)
    # Small radiating sleeve wrinkles and soft abdomen folds.
    for k in range(3):
        z=1.055+.017*k if side<0 else 1.094+.016*k;x=side*(.256 if side<0 else .274)
        tube('Sleeve_Fold_'+str(side)+'_'+str(k),[(x-side*.027,-.043,z-.012),(x,-.055,z),(x+side*.024,-.040,z+.007)],.00125,'Top',radii=[.05,1,.05],resolution=4,sides=6)
for side in (-1,1):
    tube('Hem_Drape_'+str(side),[(side*.140,-.030,.948),(side*.099,-.061,.929),(side*.040,-.074,.923)],.0012,'Top',radii=[.05,1,.05],resolution=4,sides=6)

# Tailored trouser pelvis and legs meet through a continuous crotch surface.
pelvis=loft('Pants_Pelvis',[(0,.018,.782,.136,.085),(0,.018,.817,.148,.091),(0,.017,.877,.148,.089),
 (0,.016,.909,.141,.085)],'Pants',sides=48,sub=1)
LEGS={-1:[(-.076,.015,.839),(-.080,.009,.692),(-.085,.000,.489),(-.091,.007,.296),(-.093,.007,.137)],
       1:[(.074,.018,.839),(.084,.014,.685),(.102,-.021,.487),(.112,-.040,.303),(.112,-.045,.142)]}
legobjs=[]
for side in (-1,1):
    pts=catmull(LEGS[side],8);vv=[];ff=[];ns=44
    for j,c in enumerate(pts):
        t=j/(len(pts)-1);r=.084*(1-t)+.045*t
        for i in range(ns):
            a=2*pi*i/ns
            wr=.0028*sin(47*t+2.5*a)*exp(-((t-.92)/.10)**2)+.0015*sin(35*t+3*a)*exp(-((t-.51)/.12)**2)
            crease=.0012*exp(-((sin(a)+1)/.14)**2)
            vv.append((c.x+(r+wr)*cos(a),c.y+(r*.91+wr+crease)*sin(a),c.z))
    for j in range(len(pts)-1):
        for i in range(ns):
            a=j*ns+i;b=j*ns+(i+1)%ns;ff.append((a,b,b+ns,a+ns))
    ff += [tuple(reversed(range(ns))),tuple((len(pts)-1)*ns+i for i in range(ns))]
    legobjs.append(mesh('Pants_Leg_'+str(side),vv,ff,'Pants'))
pants=remesh_join([pelvis]+legobjs,'Pants_Continuous_Tailoring',.0040,3)
m=pants.modifiers.new('Tailoring topology economy','DECIMATE');m.ratio=.36;apply_mod(pants,m)
for side in (-1,1):
    # Slanted inset pockets visible below the sweater edge.
    tube('Pocket_Welt_'+str(side),[(side*.115,-.043,.900),(side*.135,-.040,.868),(side*.142,-.020,.833)],.00155,'Pants_Seam',radii=[.5,1,.5],resolution=5,sides=6)
    p=LEGS[side];pts=[]
    for k,c in enumerate(p):
        t=k/(len(p)-1);r=.084*(1-t)+.045*t;pts.append((c[0]+side*r*.96,c[1]-.009,c[2]))
    tube('Pants_Outseam_'+str(side),pts,.0009,'Pants_Seam',radii=[.3,1,1,1,.3],resolution=5,sides=6)
    ankle=Vector(p[-1]);band('Pants_Hem_'+str(side),ankle.x,ankle.y,ankle.z+.017,.046,.042,.021,'Pants',rib=44)
    # Pressed front crease stops naturally above the sneaker.
    pts=[]
    for k,c in enumerate(p[1:]):
        t=(k+1)/(len(p)-1);r=.084*(1-t)+.045*t;pts.append((c[0],c[1]-r*.91-.0007,c[2]+.015))
    tube('Pressed_Crease_'+str(side),pts,.00065,'Pants',radii=[.05,.8,1,.05],resolution=5,sides=6)

# Anatomical relaxed hands: continuous palm, four varied three-segment fingers,
# thumb web, knuckles and fitted nails. No visible component balls.
for side in (-1,1):
    wr=Vector(ARM[side][-1]);basez=wr.z-.020;cx=wr.x;cy=wr.y
    parts=[]
    parts.append(loft('Hand_Palm_'+str(side),[(cx,cy,basez+.027,.025,.020),(cx,cy,basez+.006,.029,.021),
        (cx,cy-.001,basez-.026,.032,.020),(cx,cy,basez-.048,.028,.017),(cx,cy+.001,basez-.054,.022,.014)],'Skin','hand',32,1))
    # The index is on the thumb/inside edge, the little finger on the outside.
    offsets=[-.022,-.007,.009,.022];lengths=[.060,.070,.066,.051];rads=[.0084,.0090,.0085,.0071]
    for k,(of,ln,rr) in enumerate(zip(offsets,lengths,rads)):
        xx=cx+side*of;zz=basez-.043+(.004 if k==3 else 0)
        spread=side*(k-1.4)*.0030
        pts=[(xx,cy-.0005,zz+.007),(xx+spread*.3,cy-.001,zz-.016),
             (xx+spread*.8,cy-.003,zz-ln*.65),(xx+spread,cy+.006,zz-ln)]
        parts.append(tube('Finger_'+str(side)+'_'+str(k),pts,rr,'Skin','hand',radii=[1.06,1,.9,.72,.42],resolution=5,sides=12))
        tip=Vector(pts[-1]);nailz=tip.z+.011
        nail=ellipsoid('Nail_'+str(side)+'_'+str(k),(tip.x,cy-.003,nailz),(rr*.68,.00135,.0078),'Nails','hand',20,12)
        # Small crease on the front of each proximal joint.
        xxj=xx+spread*.4;zj=zz-.020
        tube('Knuckle_Crease_'+str(side)+'_'+str(k),[(xxj-rr*.5,cy-.009,zj),(xxj,cy-.011,zj-.001),(xxj+rr*.5,cy-.009,zj)],.00032,'Lips','hand',radii=[.1,1,.1],resolution=2,sides=4)
    thumbpts=[(cx-side*.020,cy,basez-.010),(cx-side*.040,cy-.003,basez-.025),
              (cx-side*.045,cy-.012,basez-.047),(cx-side*.041,cy-.011,basez-.066)]
    parts.append(tube('Thumb_'+str(side),thumbpts,.0125,'Skin','hand',radii=[1.1,1,.78,.53],resolution=6,sides=12))
    hand=remesh_join(parts,'Hand_Continuous_'+str(side),.00165,3)
    m=hand.modifiers.new('Hand topology economy','DECIMATE');m.ratio=.42;apply_mod(hand,m)
    p=Vector(thumbpts[-1]);ellipsoid('Thumb_Nail_'+str(side),(p.x,cy-.019,p.z+.010),(.0068,.0014,.008),'Nails','hand',20,12)

# Sneakers are lasted, not rounded cubes: profiled toe spring, multi-level sole,
# quarters, toe-cap stitching, tongue, eyelets, crossing laces and pull tabs.
SHOE_PROFILE=[(-.151,.012,.052),(-.140,.035,.065),(-.113,.050,.080),(-.065,.050,.100),
 (-.025,.047,.134),(.015,.043,.152),(.056,.041,.137),(.079,.036,.101),(.086,.018,.079)]
def shoewidth(y):return interp(SHOE_PROFILE,y)[0]
def shoeheight(y):return interp(SHOE_PROFILE,y)[1]
def shoe_surface(cx,cy,x,y):
    w,h=interp(SHOE_PROFILE,y)
    return .043+(h-.043)*sqrt(max(.06,1-(x/max(w,.001))**2))
for side in (-1,1):
    ax,ay,az=LEGS[side][-1];cx=ax;cy=ay+.005
    # Outline follows the last, including a straighter inside edge.
    outline=[]
    for j in range(80):
        a=2*pi*j/80;y=-.032+.119*cos(a);w=shoewidth(y)
        x=w*sin(a)
        outline.append((x,y))
    vv=[];ff=[]
    for z,f in [(0,.92),(.005,1.00),(.018,1.02),(.033,1.02),(.042,.98),(.044,.94)]:
        for x,y in outline:vv.append((cx+x*f,cy+y,z+.004*max(0,(-y-.098)/.055)))
    for j in range(5):
        for i in range(80):
            a=j*80+i;b=j*80+(i+1)%80;ff.append((a,b,b+80,a+80))
    ff += [tuple(reversed(range(80))),tuple(400+i for i in range(80))]
    mesh('Sneaker_Sole_'+str(side),vv,ff,'Sole')
    vv=[];ff=[];ny=40;na=32
    for j in range(ny):
        y=-.151+.237*j/(ny-1);w,h=interp(SHOE_PROFILE,y)
        for i in range(na):
            a=pi*i/(na-1);x=w*cos(a);z=.041+(h-.041)*sin(a)**.72
            vv.append((cx+x,cy+y,z))
    for j in range(ny-1):
        for i in range(na-1):
            a=j*na+i;ff.append((a,a+1,a+1+na,a+na))
    ff += [tuple(reversed(range(na))),tuple((ny-1)*na+i for i in range(na))]
    mesh('Sneaker_Upper_'+str(side),vv,[tuple(reversed(f)) for f in ff],'Shoes')
    # Understated side quarter overlays and stitched border.
    for edge in (-1,1):
        pts=[]
        for y,z in [(-.110,.054),(-.075,.068),(-.030,.080),(.018,.105),(.060,.085)]:
            w=shoewidth(y);pts.append((cx+edge*w*.91,cy+y,z))
        tube('Sneaker_Quarter_'+str(side)+'_'+str(edge),pts,.004,'Shoe_Panel',radii=[.2,1,1,.85,.25],resolution=4,sides=8,flat=.45)
        pts=[]
        for y in (-.129,-.118,-.100,-.079):
            x=edge*shoewidth(y)*.72;pts.append((cx+x,cy+y,shoe_surface(cx,cy,x,y)+.0014))
        tube('Toe_Stitch_'+str(side)+'_'+str(edge),pts,.0008,'Shoe_Panel',radii=[.1,1,1,.1],resolution=4,sides=6)
    # Tongue appears between the lace facings.
    tv=[];tf=[]
    for j in range(10):
        y=-.070+.108*j/9
        for i in range(12):
            x=-.023+.046*i/11;z=shoe_surface(cx,cy,x,y)+.0024
            tv.append((cx+x,cy+y,z))
    for j in range(9):
        for i in range(11):
            a=j*12+i;tf.append((a,a+1,a+13,a+12))
    mesh('Sneaker_Tongue_'+str(side),tv,tf,'Shoes')
    for k in range(5):
        y=-.070+.020*k;ex=.028-.0018*k
        for edge in (-1,1):
            x=edge*ex;z=shoe_surface(cx,cy,x,y)+.003
            ellipsoid('Lace_Eyelet_'+str(side)+'_'+str(k)+'_'+str(edge),(cx+x,cy+y,z),(.0031,.0031,.0013),'Shoe_Eyelet',seg=16,rings=8)
        yn=y+.014 if k<4 else y-.012
        z1=shoe_surface(cx,cy,ex,y)+.006;z2=shoe_surface(cx,cy,-ex,yn)+.006
        tube('Crossed_Lace_'+str(side)+'_'+str(k),[(cx-ex,cy+y,z1),(cx,cy+(y+yn)/2,max(z1,z2)+.007),(cx+ex,cy+yn,z2)],.0015,'Shoes',radii=[.8,1,.8],resolution=4,sides=6)
    # A tidy bow and heel pull tab.
    z=shoeheight(.014)+.011
    for edge in (-1,1):
        tube('Lace_Bow_'+str(side)+'_'+str(edge),[(cx,cy+.010,z),(cx+edge*.014,cy+.004,z+.004),(cx+edge*.018,cy+.016,z+.002),(cx,cy+.013,z)],.00135,'Shoes',resolution=5,sides=6)
    tube('Heel_Pull_'+str(side),[(cx-.009,cy+.066,.120),(cx-.009,cy+.074,.152),(cx+.009,cy+.074,.152),(cx+.009,cy+.066,.120)],.0025,'Shoe_Panel',resolution=4,sides=8)
    # Fine sole foxing line and shallow heel grooves.
    pts=[(cx+x*1.025,cy+y,.027+.004*max(0,(-y-.098)/.055)) for x,y in outline+[outline[0]]]
    tube('Sole_Foxing_'+str(side),pts,.00075,'Shoes',resolution=1,sides=5)
    for k in range(8):
        y=-.093+.021*k;w=shoewidth(y)
        for edge in (-1,1):tube('Sole_Groove_'+str(side)+'_'+str(k)+'_'+str(edge),[(cx+edge*w*1.024,cy+y,.007),(cx+edge*w*1.031,cy+y,.014)],.00045,'Shoe_Panel',resolution=1,sides=4)


# Hair library. Each style is one sculpted implicit mass: a cap offset from the
# real skull field above a hairline, ridge modulation that reads as combed
# clumps, optional falling curtains for the longer cuts and fringe strands that
# are snapped onto the skull surface. Faces hidden inside the head are removed.
def hair_group(name):
    o=bpy.data.objects.new(name,None);CHAR.objects.link(o);o.empty_display_type='PLAIN_AXES';o.empty_display_size=.03
    o['isHairVariant']=True;HAIR[name]=o;return o

def skull_at(p):
    P=tuple(np.array([v],dtype=np.float32) for v in p);return float(sdf_skull(P)[0])
def on_skull(p,lift):
    p=Vector(p);e=.0008
    for _ in range(7):
        d=skull_at(p)
        n=Vector([skull_at(p+Vector(a))-d for a in ((e,0,0),(0,e,0),(0,0,e))]).normalized()
        p-=n*(d-lift)
    return tuple(p)
def strand(P,pts,lifts,radii):
    return chain(P,[on_skull(p,l) for p,l in zip(pts,lifts)],radii,.005)

def hair_field(style,G):
    X,Y,Z=P=G.P
    sk=sdf_skull(P)
    ang=np.arctan2(X,-(Y-.012));aa=np.abs(ang);r=np.sqrt(X*X+(Y-.012)**2)
    top=sstep(1.585,1.655,Z)
    psi=np.arctan2(X,Z-1.56)
    if style=='Waves':ridge_top=np.cos(230*(X-.55*(Y+.03))+1.5*np.sin(Y*40))
    elif style=='Crop':ridge_top=np.cos(250*X+2.0*np.sin(Y*55+X*30))
    else:ridge_top=np.cos(26*psi+1.2*np.sin(Y*30))
    ridge_side=np.cos(34*ang+2.2*np.sin(Z*28+aa))*(.65+.35*np.cos(13*ang+5*Z))+.4*np.cos(19*ang-1.5*np.sin(Z*20))
    ridge=top*ridge_top+(1-top)*ridge_side
    hairline=np.interp(aa,[0,.55,1.0,1.45,1.9,2.6,pi],[1.670,1.662,1.636,1.600,1.560,1.505,1.485])
    thick={'Crop':.006,'Waves':.010,'Bob':.014,'Long':.014}[style]
    off=(thick+.012*top)*(.3+.7*sstep(hairline-.005,hairline+.045,Z))+.0035*ridge
    d=smax(sk-off,hairline-Z,.010)
    if style in ('Bob','Long'):
        low=1.418 if style=='Bob' else 1.245
        Rs=1/np.sqrt((np.sin(ang)/.111)**2+(np.cos(ang)/.121)**2)
        Rs=Rs*np.sqrt(np.clip(1-(np.clip(Z-1.60,0,None)/.125)**2,.05,1))   # follow the skull above its widest point
        earbump=.013*np.exp(-((aa-1.5)/.4)**2)*np.exp(-((Z-1.545)/.06)**2)
        Rc=Rs+.014+earbump+.0035*ridge_side+.012*np.clip((1.56-Z)/.30,0,1)
        if style=='Bob':Rc-=.008*np.clip((low+.06-Z)/.06,0,1)
        curtain=np.abs(r-Rc)-.010
        curtain=smax(curtain,low-Z,.012);curtain=smax(curtain,Z-1.69,.020)
        afront=1.22-(.55*sstep(1.50,1.40,Z) if style=='Long' else 0)
        curtain=smax(curtain,(afront-aa)*.12,.008)
        d=smin(d,curtain,.016)
    if style=='Waves':
        for i in range(8):
            t=i/7
            d=smin(d,strand(P,[(.030-.010*t,-.070+.014*t,1.705),(-.030-.008*t,-.092,1.672-.004*t),(-.086-.004*t,-.060+.010*t,1.626-.010*t)],
                [.016,.012,.004],[.012,.010,.004]),.008)
        for i in range(5):
            t=i/4
            d=smin(d,strand(P,[(.040,-.060+.022*t,1.705),(.092,-.028+.020*t,1.625),(.107,.000+.024*t,1.575)],[.014,.010,.005],[.011,.009,.005]),.008)
        d=ssub(d,strand(P,[(.028,-.050,1.685),(.030,-.010,1.70),(.028,.045,1.69)],[.031,.031,.031],[.008,.008,.008]),.004)
    if style=='Crop':
        for i in range(12):
            x=-.075+.150*i/11
            d=smin(d,strand(P,[(x*.7,.030,1.70),(x,-.050,1.69),(x*1.05,-.086,1.660+.006*sin(i*2.1))],[.012,.011,.005],[.010,.009,.004]),.007)
    if style=='Bob':
        for i in range(9):
            x=-.072+.144*i/8
            d=smin(d,strand(P,[(x*.75,-.055,1.70),(x,-.088,1.655),(x*1.03,-.094,1.606+.004*cos(i*1.3))],[.016,.010,.007],[.010,.009,.0075]),.008)
    if style=='Long':
        d=ssub(d,strand(P,[(0,-.050,1.685),(0,-.010,1.70),(0,.030,1.70)],[.031,.031,.031],[.008,.008,.008]),.004)
    return d,sk

for style in ('Crop','Waves','Bob','Long'):
    group=hair_group('Hair_'+style)
    HG=Grid((-.176,-.150,1.415 if style=='Bob' else 1.235 if style=='Long' else 1.470),(.176,.190,1.745),.002)
    d,sk=hair_field(style,HG)
    o=HG.surface(d,group.name+'_Mass','Hair','hair',group,adaptivity=.12)
    del d,sk,HG
    # Drop the underside buried inside the skull; the head occludes it anyway.
    C=centers(o);inside=sdf_skull(C)<-.004
    bm=bmesh.new();bm.from_mesh(o.data);bm.faces.ensure_lookup_table()
    bmesh.ops.delete(bm,geom=[bm.faces[i] for i in np.nonzero(inside)[0]],context='FACES');bm.to_mesh(o.data);bm.free()
    polish(o,{'Crop':22000,'Waves':26000,'Bob':27000,'Long':29000}[style])

# Consolidate semantic surfaces before authoring morphs. This preserves the
# native material slots and reduces scene traversal/draw overhead dramatically.
merge_groups={}
for o in OWN:merge_groups.setdefault((o.get('part','body'),o.parent.name if o.parent else ''),[]).append(o)
for (part,parent_name),parts in merge_groups.items():
    if len(parts)<2:continue
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:o.hide_set(False);o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0]
    bpy.ops.object.join();joined=parts[0]
    joined.name=(parent_name+'_Geometry') if parent_name else 'Twin_'+part.title()
    for q in parts[1:]:
        if q in OWN:OWN.remove(q)

# Shared morph geometry, authored in world coordinates. Lids, lips and brows
# are head vertices, so the same local transformation moves eyeball and socket.
def deform(co, name, part):
    x,y,z=co;dx=dy=dz=0.
    eye=part.startswith('eye_');brow=part.startswith('brow_');facial=part=='head' or eye or brow
    front=clamp((.045-y)/.085)
    if name=='FaceWidth':
        if facial or part=='hair':dx=x*.10
        elif part=='neck':dx=x*.035
    elif name=='JawWidth':
        if part in ('head','hair'):dx=x*.125*exp(-((z-1.436)/.054)**2)
    elif name=='NoseWidth':
        if part=='head':dx=x*.26*gauss(x,z,0,1.515,.028,.045)*front
    elif name=='NoseLength':
        if part=='head':
            f=gauss(x,z,0,1.520,.028,.048)*front;dz=-.0075*f;dy=-.0015*f
    elif name=='EyeSize':
        if eye:
            ex=-EYE_X if part.endswith('L') else EYE_X
            dx=(x-ex)*.135;dz=(z-EYE_Z)*.135;dy=(y-EYE_Y)*.04
        elif part=='head':
            for side in (-1,1):
                ex=side*EYE_X;f=gauss(x,z,ex,EYE_Z,.039,.025)*front
                dx+=(x-ex)*.13*f;dz+=(z-EYE_Z)*.13*f
        elif brow:dz=.0013
    elif name=='EyeSpacing':
        if eye or brow:dx=(-1 if part.endswith('L') else 1)*.0058
        elif part=='head':
            for side in (-1,1):dx+=side*.0058*gauss(x,z,side*EYE_X,EYE_Z+.018,.034,.042)*front
    elif name=='LipFullness':
        if part=='head':
            f=gauss(x,z,0,MOUTH_Z,.040,.016)*front
            dz=(z-mouthline(x))*.30*f;dy=-.0030*f
    elif name=='Smile':
        if part=='head':
            f=gauss(x,z,0,MOUTH_Z+.003,.052,.024)*front
            dz=.0095*clamp(abs(x)/.035)**2*f;dx=x*.045*f
            for side in (-1,1):dz+=.0020*gauss(x,z,side*.055,1.505,.030,.024)*front
        elif eye:dz=.0007
    elif name=='BodyShape':
        if part in ('body','hand','neck'):
            if z<.20:
                dx=(.009 if x>0 else -.009)
            elif abs(x)>.202 and z>.79:
                dx=(.023 if x>0 else -.023)*smooth(.76,.95,z)
                dy=(y-.01)*.035
            else:
                waist=exp(-((z-.985)/.245)**2)
                pelvis=exp(-((z-.775)/.22)**2)
                dx=x*(.20*waist+.075*pelvis)
                dy=(y-.015)*(.36*waist+.10*pelvis)
                if z<.55:dx+=(.009 if x>0 else -.009)*(1-smooth(.25,.55,z))
        elif part=='hair' and z<1.36:dx=x*.055*(1-smooth(1.20,1.36,z))
    return Vector((x+dx,y+dy,z+dz))

for o in list(OWN):
    if o.type!='MESH':continue
    part=o.get('part','body')
    active=[]
    for name in MORPHS:
        # Do not pay a GLB storage cost for identically zero targets.
        changes=[deform(v.co,name,part)-v.co for v in o.data.vertices]
        if max((q.length_squared for q in changes),default=0)>1e-14:active.append((name,changes))
    if not active:continue
    o.shape_key_add(name='Basis')
    for name,delta in active:
        key=o.shape_key_add(name=name);key.slider_min=0 if name in ('Smile','BodyShape') else -1;key.slider_max=1
        for v,d,k in zip(o.data.vertices,delta,key.data):k.co=v.co+d
    o['editorMorphs']=', '.join(n for n,_ in active)

# Group objects for a legible outliner without altering exported geometry.
for o in OWN:
    if o.parent:continue
    o['originalAsset']='Twin Studio / make_twin.py'
for name,p in HAIR.items():
    p['defaultVisible']=name=='Hair_Waves'
    for o in p.children:o.hide_render=name!='Hair_Waves';o.hide_set(name!='Hair_Waves')

# Native editable project plus studio lights/cameras, all excluded from GLB.
S.render.engine='CYCLES';S.cycles.samples=64;S.cycles.use_denoising=True
S.render.resolution_x=1200;S.render.resolution_y=1500;S.render.resolution_percentage=100
S.render.image_settings.file_format='PNG';S.render.film_transparent=False
S.world=bpy.data.worlds.new('Warm grey studio');S.world.use_nodes=True
S.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.28,.32,.34,1)
S.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.33
S.view_settings.view_transform='AgX'
S.view_settings.look='AgX - Medium High Contrast'

def track(o,point):o.rotation_euler=(Vector(point)-o.location).to_track_quat('-Z','Y').to_euler()
def area(name,loc,power,size,color,point):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;data.color=hexlin(color)
    o=bpy.data.objects.new(name,data);STUDIO.objects.link(o);o.location=loc;track(o,point)
area('Key — large softbox',(-2.7,-3.5,4.2),410,3.1,'fff0dc',(0,0,1))
area('Fill — cool card',(2.8,-1.6,2.7),170,2.5,'e1efff',(0,0,1.2))
area('Rim — warm edge',(1.8,2.1,3.4),470,2.2,'ffe2bc',(0,0,1.1))
material('Studio','c7c5bb',.9)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.004));floor=bpy.context.object;floor.name='Studio floor';link_obj(floor,STUDIO);floor.data.materials.append(M['Studio'])
data=bpy.data.cameras.new('Full body portrait');cam=bpy.data.objects.new('Camera_FullBody',data);STUDIO.objects.link(cam)
cam.location=(2.3,-6.1,2.35);track(cam,(0,0,.895));data.type='ORTHO';data.ortho_scale=2.06;data.lens=62
S.camera=cam
data=bpy.data.cameras.new('Face portrait');facecam=bpy.data.objects.new('Camera_Face',data);STUDIO.objects.link(facecam)
facecam.location=(.47,-2.0,1.69);track(facecam,(0,-.005,1.550));data.type='ORTHO';data.ortho_scale=.445;data.lens=85
data=bpy.data.cameras.new('Front evidence');frontcam=bpy.data.objects.new('Camera_Front',data);STUDIO.objects.link(frontcam)
frontcam.location=(0,-5,1.0);track(frontcam,(0,0,.875));data.type='ORTHO';data.ortho_scale=1.98

# Ensure exported objects are visible, selected and carry zero default weights.
for o in OWN:
    o.hide_set(False);o.hide_render=False
    if o.data.shape_keys:
        for k in o.data.shape_keys.key_blocks:k.value=0
bpy.ops.object.select_all(action='DESELECT')
for o in CHAR.objects:o.select_set(True)
bpy.context.view_layer.objects.active=head
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'twin.glb'),export_format='GLB',use_selection=True,
    export_yup=True,export_apply=False,export_animations=False,export_skins=False,
    export_morph=True,export_morph_normal=True,export_morph_tangent=False,
    export_cameras=False,export_lights=False,export_extras=True,
    export_materials='EXPORT',export_normals=True,export_texcoords=False)

def hair_visible(name):
    for n,p in HAIR.items():
        for o in p.children:o.hide_render=n!=name;o.hide_set(n!=name)
hair_visible('Hair_Waves')
bpy.ops.object.select_all(action='DESELECT');head.select_set(True);bpy.context.view_layer.objects.active=head
S.camera=cam
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ART,'twin.blend'))

# Compact artifact facts and an explicit web interface.
def triangles(o):return sum(len(p.vertices)-2 for p in o.data.polygons)
base_tris=sum(triangles(o) for o in OWN if not o.parent)
hair_tris={n:sum(triangles(o) for o in p.children if o.type=='MESH') for n,p in HAIR.items()}
bounds=[[min(v.co[i] for o in OWN for v in o.data.vertices),max(v.co[i] for o in OWN for v in o.data.vertices)] for i in range(3)]
contract={
 'asset':'twin.glb','version':1,'generator':'blender/make_twin.py','blenderVersion':bpy.app.version_string,
 'coordinates':{'up':'Y','forward':'+Z','units':'metres','feetY':0,'approximateHeight':round(bounds[2][1],3)},
 'defaultHair':'Hair_Waves','hairGroups':list(HAIR),
 'requiredMaterials':['Skin','Lips','Hair','Brows','Iris','Sclera','Top','Pants','Shoes','Sole'],
 'materialColorGroups':{'skin':['Skin'],'lips':['Lips'],'hair':['Hair','Brows'],
   'iris':['Iris','Iris_Inner','Iris_Rim','Iris_Fiber'],'top':['Top','Top_Seam'],
   'pants':['Pants','Pants_Seam'],'shoes':['Shoes','Shoe_Panel'],'sole':['Sole']},
 'morphs':{n:{'min':0 if n in ('Smile','BodyShape') else -1,'max':1,'default':0,'safeRange':[0 if n in ('Smile','BodyShape') else -1,1]} for n in MORPHS},
 'morphUsage':'Traverse every mesh; set each matching morphTargetDictionary entry to the same requested value. Negative facial weights are intentional. Apply all requested weights to all meshes including hidden hair variants.',
 'hairUsage':'All four parent groups are exported. Immediately hide all Hair_* groups except the selected exact name. Mesh children inherit visibility. Do not infer style from mesh names.',
 'meshCount':len(OWN),'baseTriangles':base_tris,'hairTriangles':hair_tris,
 'visibleTrianglesByHair':{n:base_tris+t for n,t in hair_tris.items()},
 'glbBytes':os.path.getsize(os.path.join(OUT,'twin.glb')),
 'blenderBoundsXYZ':bounds,
 'limitations':['Single original androgynous adult-ish base; not an exact photo reconstruction.',
  'No animation skeleton or facial speech rig in this first slice.',
  'Clothing is the fixed original crewneck, tailored trousers and sneakers; color and BodyShape are editable.',
  'Minor overlaps can occur when many facial controls are combined at all extremes; intended conservative manual editor range is documented per target.'],
 'authorship':'Original procedural geometry and materials. No downloaded, paid, licensed or generative image assets.'}
with open(os.path.join(OUT,'asset-contract.json'),'w') as f:json.dump(contract,f,indent=2)
print('TWIN_CONTRACT',json.dumps({'glbBytes':contract['glbBytes'],'visibleTrianglesByHair':contract['visibleTrianglesByHair'],'meshCount':len(OWN)}))

if os.environ.get('TWIN_SKIP_RENDERS')!='1':
    S.camera=cam;S.render.filepath=os.path.join(ART,'twin-fullbody.png');bpy.ops.render.render(write_still=True)
    S.camera=facecam;S.render.resolution_x=1400;S.render.resolution_y=1400
    S.render.filepath=os.path.join(ART,'twin-face.png');bpy.ops.render.render(write_still=True)
    # Safe extreme galleries use deterministic composites generated by Blender.
    S.cycles.samples=32;S.render.resolution_x=700;S.render.resolution_y=700
    for label,values in [('face-min',{n:-1 for n in MORPHS[:7]}),
                         ('face-max',{n:1 for n in MORPHS[:8]})]:
        for o in OWN:
            if o.data.shape_keys:
                for k in o.data.shape_keys.key_blocks:k.value=values.get(k.name,0)
        S.render.filepath=os.path.join(ART,'twin-'+label+'.png');bpy.ops.render.render(write_still=True)
    for o in OWN:
        if o.data.shape_keys:
            for k in o.data.shape_keys.key_blocks:k.value=1 if k.name=='BodyShape' else 0
    S.camera=frontcam;S.render.resolution_x=800;S.render.resolution_y=1100
    S.render.filepath=os.path.join(ART,'twin-body-max.png');bpy.ops.render.render(write_still=True)
    for o in OWN:
        if o.data.shape_keys:
            for k in o.data.shape_keys.key_blocks:k.value=0
    S.camera=facecam;S.render.resolution_x=750;S.render.resolution_y=900;facecam.data.ortho_scale=.58
    for name in ('Hair_Crop','Hair_Bob','Hair_Long'):
        hair_visible(name);S.render.filepath=os.path.join(ART,name+'.png');bpy.ops.render.render(write_still=True)
    hair_visible('Hair_Waves');facecam.data.ortho_scale=.445
    S.camera=cam;S.render.resolution_x=1200;S.render.resolution_y=1500;S.cycles.samples=64
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ART,'twin.blend'))
print('TWIN_BUILD_COMPLETE')
