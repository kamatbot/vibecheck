"""Twin Studio — original, editable stylized character.

Rebuild with Blender 5.2:
  /Applications/Blender.app/Contents/MacOS/Blender -b --python blender/make_twin.py

All geometry is authored here; no external asset or texture is used. Blender is
Z-up, facing -Y. The glTF exporter converts to Y-up, facing +Z. Linear shape
keys expose conservative, combinable editorial changes, not a rigged identity
reconstruction. The .blend retains the editable meshes and shape-key library.
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

# Continuous head: cross-section silhouette with cheek planes, eye sockets,
# muzzle, integrated bridge/tip/alae, brow ridge, philtrum and a defined chin.
PROFILE=[(1.390,.010,.018,.020),(1.398,.040,.060,.036),
 (1.414,.068,.073,.048),(1.438,.090,.079,.067),(1.470,.099,.088,.086),
 (1.503,.111,.093,.101),(1.540,.109,.094,.107),(1.577,.108,.091,.108),
 (1.615,.106,.090,.102),(1.650,.096,.080,.090),(1.682,.066,.055,.061),
 (1.702,.015,.013,.014),(1.704,.001,.001,.001)]

def face_y(x,z):
    w,fd,bd=interp(PROFILE,z)
    base=-fd*sqrt(max(.005,1-(x/max(w,.001))**2))
    d=0
    # Expressive sockets, subtle raised cheeks and brow volumes.
    for side in (-1,1):
        ex=side*.044
        d += .0095*gauss(x,z,ex,1.566,.033,.018)
        d -= .0090*gauss(x,z,side*.060,1.509,.039,.030)
        d -= .0075*gauss(x,z,side*.041,1.594,.035,.013)
        d += .0028*gauss(x,z,side*.038,1.483,.008,.018)
        d -= .0110*gauss(x,z,side*.0165,1.505,.011,.009)
    d -= .018*gauss(x,z,0,1.548,.012,.039)
    d -= .029*gauss(x,z,.001,1.514,.0175,.014)
    d -= .006*gauss(x,z,0,1.490,.010,.013)
    d -= .006*gauss(x,z,0,1.465,.034,.018)
    d -= .010*gauss(x,z,0,1.419,.037,.016)
    d += .002*gauss(x,z,0,1.483,.0035,.008)
    d += .0017*gauss(x,z,0,1.443,.026,.005)
    d -= .0012*gauss(x,z,-.045,1.523,.025,.038)
    return base+d

verts=[];faces=[];N=112;R=86
for j in range(R):
    z=1.390+(1.704-1.390)*j/(R-1)
    w,fd,bd=interp(PROFILE,z)
    for i in range(N):
        a=2*pi*i/N;xx=w*cos(a);front=-sin(a)
        yy=-fd*front if front>=0 else -bd*front
        if front>0:
            ellipse=-fd*sqrt(max(.005,1-(xx/max(w,.001))**2))
            yy+=(face_y(xx,z)-ellipse)*smooth(.05,.8,front)
        xx+=.0013*sin((z-1.39)*14)*smooth(.02,.8,front)
        verts.append((xx,yy,z))
for j in range(R-1):
    for i in range(N):
        a=j*N+i;b=j*N+(i+1)%N;faces.append((a,b,b+N,a+N))
faces += [tuple(reversed(range(N))),tuple((R-1)*N+i for i in range(N))]
head=mesh('Head_Sculpt',verts,faces,'Skin','head')
m=head.modifiers.new('Gentle sculpt polish','SMOOTH');m.factor=.35;m.iterations=2;apply_mod(head,m)

# Neck has trapezius flare beneath the crew neck and a proper under-chin join.
loft('Neck',[(0,.022,1.284,.075,.060),(0,.022,1.323,.060,.047),
 (0,.021,1.366,.042,.040),(0,.022,1.414,.045,.038),(0,.024,1.443,.050,.041)],'Skin','neck',40,1)

# Ears: pinna base, recessed concha, continuous helix and antihelix.
for side in (-1,1):
    s='L' if side<0 else 'R'
    ellipsoid('Ear_'+s,(side*.109,.011,1.545),(.021,.016,.036),'Skin','ear',32,20)
    ellipsoid('Ear_Concha_'+s,(side*.119,-.003,1.545),(.009,.006,.019),'Lips','ear',24,16)
    pts=[(side*x,y,z) for x,y,z in [(.110,-.007,1.517),(.125,-.006,1.524),(.129,-.004,1.548),(.127,.000,1.571),(.115,-.002,1.577),(.109,-.004,1.568)]]
    tube('Ear_Helix_'+s,pts,.0042,'Skin','ear',radii=[.5,.85,1,.95,.75,.2],resolution=5,sides=8)
    pts=[(side*x,y,z) for x,y,z in [(.115,-.010,1.523),(.119,-.010,1.540),(.117,-.010,1.558),(.121,-.006,1.568)]]
    tube('Ear_Antihelix_'+s,pts,.0028,'Skin','ear',radii=[.3,1,.9,.15],resolution=4,sides=8)
    ellipsoid('Ear_Tragus_'+s,(side*.108,-.008,1.539),(.0045,.005,.008),'Skin','ear',20,12)

# Eye openings are almond patches on embedded spherical corneas, framed by
# tapered skin lids. Irises are concentric geometric lenses with radial fibers.
EYE_Z=1.566;EYE_X=.043;EYE_Y=-.0705;EYE_R=.0295
def eyefront(dx,dz):return EYE_Y-sqrt(max(.000004,EYE_R**2-dx*dx-dz*dz))
def eyelid_point(side,t,outer=0):
    # t traverses a closed almond; slight outer-corner rise avoids a doll stare.
    dx=cos(t)*(.0270+outer)
    h=(.0105 if sin(t)>0 else .0068)+outer*.58
    dz=sin(t)*h+side*dx*.055
    return (side*EYE_X+dx,eyefront(dx,dz)+outer*.27,EYE_Z+dz)

for side in (-1,1):
    sn='L' if side<0 else 'R';part='eye_'+sn
    ev=[(side*EYE_X,eyefront(0,0),EYE_Z)]
    EF=[];rings=9;seg=64
    for j in range(1,rings+1):
        rr=j/rings
        for i in range(seg):
            p=eyelid_point(side,2*pi*i/seg)
            dx=(p[0]-side*EYE_X)*rr;dz=(p[2]-EYE_Z)*rr
            ev.append((side*EYE_X+dx,eyefront(dx,dz),EYE_Z+dz))
    for i in range(seg):EF.append((0,1+i,1+(i+1)%seg))
    for j in range(rings-1):
        for i in range(seg):
            a=1+j*seg+i;b=1+j*seg+(i+1)%seg;EF.append((a,a+seg,b+seg,b))
    mesh('Eye_Sclera_'+sn,ev,EF,'Sclera',part)
    # A socket-to-eye transition, with an actual inner waterline.
    lv=[];lf=[]
    for k,off in enumerate((0,.0016,.0038,.0075)):
        for i in range(seg):
            p=list(eyelid_point(side,2*pi*i/seg,off))
            if k==0:p[1]-=.0006
            elif k==1:p[1]-=.0014
            elif k==2:p[1]-=.0006
            else:p[1]=face_y(p[0],p[2])-.0007
            lv.append(tuple(p))
    for k in range(3):
        for i in range(seg):
            a=k*seg+i;b=k*seg+(i+1)%seg;lf.append((a,b,b+seg,a+seg))
    mesh('Eyelids_'+sn,lv,[tuple(reversed(f)) for f in lf],'Skin',part)
    # Thin, tapered upper lashes and naturally broken lower waterline.
    pts=[eyelid_point(side,pi*t/12,.0002) for t in range(13)]
    pts=[(x,y-.001,z+.0002) for x,y,z in pts]
    tube('Lash_Line_'+sn,pts,.00105,'Brows',part,radii=[.08,.65,.9,1,.8,.5,.12],resolution=2,sides=6)
    pts=[]
    for i in range(9):
        t=.16*pi+.68*pi*i/8;p=list(eyelid_point(side,t,.0058));p[2]+=.004;p[1]=face_y(p[0],p[2])-.001
        pts.append(p)
    tube('Lid_Crease_'+sn,pts,.0007,'Lips',part,radii=[.05,.7,1,.8,.05],resolution=2,sides=6)
    # Lens rings sit flush on the eye globe; pupil and dark limbal ring inset.
    iv=[];ifs=[];IR=.0107;rad=[0,.0042,.0049,.0072,.0100,.0107]
    for rr in rad:
        for i in range(64):
            t=2*pi*i/64;dx=rr*cos(t);dz=rr*sin(t)+.0002
            almond=sqrt(max(.01,1-(dx/.0270)**2))
            dz=clamp(dz,-.0068*almond+side*dx*.055+.0004,.0105*almond+side*dx*.055-.0004)
            iv.append((side*EYE_X+dx,eyefront(dx,dz)-.00030,EYE_Z+dz))
    for j in range(len(rad)-1):
        for i in range(64):
            a=j*64+i;b=j*64+(i+1)%64;ifs.append((a,b,b+64,a+64))
    io=mesh('Iris_Lens_'+sn,iv,[tuple(reversed(f)) for f in ifs],'Iris',part)
    for key in ('Pupil','Iris_Inner','Iris_Rim','Iris_Fiber'):io.data.materials.append(M[key])
    for p in io.data.polygons:
        ring=p.index//64
        p.material_index=1 if ring==0 else 2 if ring==1 else 3 if ring==4 else (4 if p.index%7==0 else 0)
    for j,(dx,dz,r) in enumerate([(-.0031,.0048,.0020),(.0038,-.0034,.00072)]):
        ellipsoid('Eye_Glint_'+sn+'_'+str(j),(side*EYE_X+dx,eyefront(dx,dz)-.00065,EYE_Z+dz),(r,.00045,r),'Catchlight',part,16,10)
    # Tapered brow ribbon, plus fine directional edge hairs.
    pts=[]
    for i in range(11):
        t=i/10;xx=side*(.018+.061*t);zz=1.602+.009*sin(pi*t)-.003*t+(side*.0015)
        pts.append((xx,face_y(xx,zz)-.0024,zz))
    tube('Brow_'+sn,pts,.0039,'Brows','brow_'+sn,radii=[.45,.9,1,.95,.72,.12],resolution=3,sides=8,flat=.60)
    for i in range(12):
        t=(i+.2)/13;xx=side*(.018+.061*t);zz=1.602+.009*sin(pi*t)-.003*t+(side*.0015)
        xx2=xx+side*.0035;zz2=zz+.0040*(1-t)
        tube('Brow_Fiber_'+sn+'_'+str(i),[(xx,face_y(xx,zz)-.003,zz),(xx2,face_y(xx2,zz2)-.003,zz2)],.00042,'Brows','brow_'+sn,radii=[1,.05],resolution=1,sides=4)

# Nostrils and alar folds sit on the integrated nose, not separate nose balls.
for side in (-1,1):
    xx=side*.0128;zz=1.5020;yy=face_y(xx,zz)
    ellipsoid('Nostril_'+str(side),(xx,yy-.0006,zz),(.0049,.00125,.0025),'Nostril','nose',24,12)
    pts=[]
    for i in range(6):
        t=i/5;xx=side*(.019+.002*sin(pi*t));zz=1.509-.010*t
        pts.append((xx,face_y(xx,zz)-.0004,zz))
    tube('Alar_Fold_'+str(side),pts,.00052,'Lips','nose',radii=[.05,.4,.9,.2],resolution=2,sides=6)

# Lip surfaces share a shaped cupid's bow and a closed, relaxed mouth seam.
MOUTH_Z=1.460
def mouthline(x):return MOUTH_Z+.0029*(abs(x)/.033)**2+.0004*x/.033
for upper in (True,False):
    vv=[];ff=[];U=64;V=9
    for j in range(V):
        t=j/(V-1)
        for i in range(U):
            x=-.034+.068*i/(U-1);f=max(0,1-(x/.034)**2)**.7
            cupid=1+.28*exp(-((abs(x)-.009)/.0045)**2)-.21*exp(-(x/.004)**2)
            height=(.0058*cupid if upper else .0072)*f
            z=mouthline(x)+(height*t if upper else -height*t)
            y=face_y(x,z)-.0004-.0037*f*sin(pi*t*.88)-.0018*f*(1-t)
            vv.append((x,y,z))
    for j in range(V-1):
        for i in range(U-1):
            a=j*U+i;ff.append((a,a+1,a+1+U,a+U))
    mesh('Lip_Upper' if upper else 'Lip_Lower',vv,ff if upper else [tuple(reversed(f)) for f in ff],'Lips','lip')
pts=[]
for i in range(17):
    x=-.0335+.067*i/16;z=mouthline(x);pts.append((x,face_y(x,z)-.0026,z))
tube('Mouth_Closed_Seam',pts,.0008,'MouthCrease','lip',radii=[.1,.8,1,.8,.1],resolution=2,sides=6)

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
m=top.modifiers.new('Cloth topology economy','DECIMATE');m.ratio=.38;apply_mod(top,m)

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
    m=hand.modifiers.new('Hand topology economy','DECIMATE');m.ratio=.68;apply_mod(hand,m)
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

# Hair library. Every style has a proper closed scalp shell, directional flow
# carved into broad flattened masses, tapered ends and restrained flyaways.
def hair_group(name):
    o=bpy.data.objects.new(name,None);CHAR.objects.link(o);o.empty_display_type='PLAIN_AXES';o.empty_display_size=.03
    o['isHairVariant']=True;HAIR[name]=o;return o

def haircap(group,style):
    vv=[];ff=[];nr=28;ns=96
    rz=.170 if style=='Crop' else .177
    for j in range(nr):
        t=j/(nr-1)
        for i in range(ns):
            a=2*pi*i/ns;front=max(0,-sin(a));back=max(0,sin(a))
            end=1.75-.65*front+.21*back
            if style=='Crop':end-=.04*front
            if style in ('Bob','Long'):end=1.84-.67*front+.11*back
            end+=.025*sin(5*a+.5)+.012*sin(13*a)
            ph=.012+t*end
            flow=.0008*sin(19*a+ph*8)+.00055*sin(31*a+ph*5)
            rx=.117+flow;ry=.112+flow
            x=rx*sin(ph)*cos(a);y=.014+ry*sin(ph)*sin(a);z=1.552+rz*cos(ph)
            if style=='Waves':z+=.002*exp(-((a-4.0)/.9)**2)*sin(ph)
            vv.append((x,y,z))
    for j in range(nr-1):
        for i in range(ns):
            a=j*ns+i;b=j*ns+(i+1)%ns;ff.append((a,b,b+ns,a+ns))
    o=mesh(group.name+'_Scalp',vv,[tuple(reversed(f)) for f in ff],'Hair','hair',group)
    mod=o.modifiers.new('Hairline thickness','SOLIDIFY');mod.thickness=.003;apply_mod(o,mod)
    return o

def lock(name,points,width,thickness,parent,profile=None):
    path=catmull(points,6);vv=[];ff=[];ns=10
    for i,p in enumerate(path):
        t=i/(len(path)-1);tan=(path[min(i+1,len(path)-1)]-path[max(0,i-1)]).normalized()
        # Local scalp normal gives a flattened ribbon following the head.
        normal=Vector((p.x,(p.y-.014)*1.15,(p.z-1.552)*.82)).normalized()
        if p.z<1.51:normal=Vector((p.x,p.y-.014,.015)).normalized()
        u=tan.cross(normal).normalized();v=u.cross(tan).normalized()
        if not u.length:u=Vector((1,0,0));v=Vector((0,1,0))
        taper=(.22+.78*sin(pi*min(.97,t+.08))**.6)*(1-.94*smooth(.79,1,t))
        for k in range(ns):
            a=2*pi*k/ns
            # A shallow central ridge catches light without cylindrical locks.
            ridge=1+.16*cos(3*a)
            vv.append(tuple(p+u*(width*taper*cos(a))+v*(thickness*taper*sin(a)*ridge)))
    for j in range(len(path)-1):
        for i in range(ns):
            a=j*ns+i;b=j*ns+(i+1)%ns;ff.append((a,b,b+ns,a+ns))
    ff += [tuple(reversed(range(ns))),tuple((len(path)-1)*ns+i for i in range(ns))]
    return mesh(name,vv,ff,'Hair','hair',parent)

def scalp_point(a,ph,lift=.003):
    return ((.118+lift)*sin(ph)*cos(a),.014+(.113+lift)*sin(ph)*sin(a),1.552+(.177+lift)*cos(ph))

for style in ('Crop','Waves','Bob','Long'):
    group=hair_group('Hair_'+style);haircap(group,style)
    if style=='Crop':
        for i in range(18):
            t=i/17
            pts=[scalp_point(.35+.95*t,.75,.000),scalp_point(-.15-1.4*t,.22+.22*t,.000),scalp_point(-.95-1.20*t,.65+.15*t,.000),scalp_point(-1.18-1.1*t,1.06+.18*t,.000)]
            lock(group.name+'_Flow_'+str(i),pts,.0105,.0025,group)
    else:
        # Side-parted sweep: broad asymmetrical strands across the crown.
        for i in range(13):
            t=i/12
            pts=[scalp_point(.8-.5*t,.60+.40*t),scalp_point(-.40-1.0*t,.24+.58*t),
                 scalp_point(-1.60-.80*t,.60+.50*t),scalp_point(-1.80-.80*t,1.08+.42*t)]
            lock(group.name+'_Sweep_'+str(i),pts,.0135,.0038,group)
        # Smaller section on the other side of the part.
        for i in range(7):
            t=i/6
            pts=[scalp_point(.7-.5*t,.64),scalp_point(.22-.38*t,.70+.10*t),scalp_point(-.14-.40*t,1.0+.04*t),scalp_point(-.12-.47*t,1.45+.09*t)]
            lock(group.name+'_Part_'+str(i),pts,.0105,.0030,group)
    if style in ('Bob','Long'):
        low=1.421 if style=='Bob' else 1.238
        # Continuous back curtain prevents gaps between decorative masses.
        vv=[];ff=[];ns=60;nr=24
        for j in range(nr):
            t=j/(nr-1)
            for i in range(ns):
                a=-.18+(pi+.36)*i/(ns-1)
                w=.114+.013*sin(pi*t)+(.021*t if style=='Long' else .008*t)
                dep=.106+.010*sin(pi*t)
                x=w*cos(a);y=.017+dep*sin(a)
                z=1.615+(low-1.615)*t+.008*sin(9*a+.5)*t**4
                x+=.003*sin(t*8+a*3)*t
                vv.append((x,y,z))
        for j in range(nr-1):
            for i in range(ns-1):
                a=j*ns+i;ff.append((a,a+1,a+1+ns,a+ns))
        o=mesh(group.name+'_Curtain',vv,[tuple(reversed(f)) for f in ff],'Hair','hair',group)
        m=o.modifiers.new('Hair curtain thickness','SOLIDIFY');m.thickness=.009;apply_mod(o,m)
        for i in range(20):
            a=-.12+(pi+.24)*i/19;xx=.116*cos(a);yy=.018+.110*sin(a)
            pts=[(xx*.78,yy*.91,1.659),(xx*1.01,yy*1.05,1.565),
                 (xx*1.10+.003*sin(i),yy*1.02,low+.081),(xx*1.11+.008*sin(i*.9),yy*.95,low-.008+(.018*sin(i*1.7)))]
            lock(group.name+'_Fall_'+str(i),pts,.016,.006,group)
        # Face-framing front sections tuck into the silhouette.
        for side in (-1,1):
            for k in range(3):
                end=low+.032+.018*k
                pts=[(side*.087,-.058,1.679),(side*(.113+.003*k),-.069,1.563),
                     (side*(.115+.007*k),-.060,1.462),(side*(.121+.009*k),-.042,end)]
                lock(group.name+'_Frame_'+str(side)+'_'+str(k),pts,.012,.006,group)
    # Short sideburns stay attached to the temple and taper into the ear.
    if style in ('Crop','Waves'):
        for side in (-1,1):
            lock(group.name+'_Temple_'+str(side),[(side*.110,-.018,1.626),(side*.114,-.025,1.584),(side*.110,-.022,1.542)],.013,.004,group)

# The scalp and groom must clear the actual non-ellipsoidal forehead. Enforce
# a measured radial clearance against the head's cross sections, including
# interpolated lock vertices; control-point fitting alone leaves intersections.
for o in OWN:
    if o.get('part')!='hair':continue
    def radial_correction(co,clearance):
        x,y,z=co
        if not 1.398<z<1.704:return Vector((0,0,0))
        w,fd,bd=interp(PROFILE,z)
        angle=math.atan2(y,x);c=cos(angle);s=sin(angle)
        depth=fd if s<0 else bd
        skin_r=1/sqrt((c/max(w,.001))**2+(s/max(depth,.001))**2)
        actual_r=sqrt(x*x+y*y)
        required=skin_r+clearance
        if actual_r<required and actual_r>.0001:
            return Vector((x*(required/actual_r-1),y*(required/actual_r-1),0))
        return Vector((0,0,0))
    if '_Scalp' in o.name or '_Curtain' in o.name:
        for v in o.data.vertices:
            outward=v.normal.dot(Vector((v.co.x,v.co.y,0)))>0
            v.co+=radial_correction(v.co,.009 if outward else .005)
    else:
        # Move a whole ten-vertex lock section together. Projecting each
        # vertex separately collapses thickness and creates coplanar glitter.
        for i in range(0,len(o.data.vertices),10):
            ring=list(o.data.vertices)[i:i+10]
            center=sum((v.co for v in ring),Vector())/len(ring)
            correction=radial_correction(center,.015)
            for v in ring:v.co+=correction
    # Directional ridges survive a conservative collapse; hidden voxel density
    # has already been removed from clothing, preserving the full face surface.
    m=o.modifiers.new('Groom topology economy','DECIMATE');m.ratio=.69;apply_mod(o,m)

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

# Actual shared morph geometry, authored in world coordinates. Every eye part
# uses the same local transformation, keeping the iris, glints and lids aligned.
def deform(co, name, part):
    x,y,z=co;dx=dy=dz=0.
    facial=part in ('head','ear','lip','nose') or part.startswith(('eye_','brow_'))
    eye=part.startswith('eye_');brow=part.startswith('brow_')
    front=smooth(.025,-.060,y) if False else clamp((.045-y)/.085)
    if name=='FaceWidth':
        if facial or part=='hair':dx=x*.10
        elif part=='neck':dx=x*.035
    elif name=='JawWidth':
        if part in ('head','ear','lip','hair'):
            influence=exp(-((z-1.438)/.054)**2)
            dx=x*.125*influence
    elif name=='NoseWidth':
        if part in ('head','nose'):
            f=gauss(x,z,0,1.514,.026,.040)*front
            dx=x*.26*f
    elif name=='NoseLength':
        if part in ('head','nose'):
            f=gauss(x,z,0,1.520,.026,.042)*front
            dz=-.0075*f;dy=-.0015*f
    elif name=='EyeSize':
        if eye:
            ex=-EYE_X if part.endswith('L') else EYE_X
            dx=(x-ex)*.135;dz=(z-EYE_Z)*.135;dy=(y-EYE_Y)*.06
        elif part=='head':
            for side in (-1,1):
                ex=side*EYE_X;f=gauss(x,z,ex,EYE_Z,.039,.025)*front
                dx+=(x-ex)*.13*f;dz+=(z-EYE_Z)*.13*f
        elif brow:dz=.0013
    elif name=='EyeSpacing':
        if eye or brow:dx=(-1 if part.endswith('L') else 1)*.0058
        elif part=='head':
            for side in (-1,1):dx+=side*.0058*gauss(x,z,side*EYE_X,1.575,.032,.039)*front
    elif name=='LipFullness':
        if part=='lip':
            f=max(0,1-(x/.038)**2);dz=(z-mouthline(x))*.32;dy=-.0026*f
        elif part=='head':
            f=gauss(x,z,0,1.460,.038,.014)*front
            dz=(z-MOUTH_Z)*.16*f;dy=-.0012*f
    elif name=='Smile':
        if part=='lip':
            t=clamp(abs(x)/.034);dz=.009*t*t;dx=x*.065
            dy=.0015*t*t
        elif part=='head':
            f=gauss(x,z,0,1.463,.052,.024)*front
            dz=.0085*clamp(abs(x)/.035)**2*f;dx=x*.040*f
            for side in (-1,1):dz+=.0018*gauss(x,z,side*.055,1.507,.030,.024)*front
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
