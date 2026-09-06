# Stylised teen avatars: 8 bases (4m/4f) + 8 attribute accessories -> avatars.glb + preview.png
# Run: /Applications/Blender.app/Contents/MacOS/Blender -b --python blender/make_avatars.py
# Shared skeleton: head centre HC=(0,0,1.62) r=.30 so every accessory fits every base. Front = -Y.
import bpy, math, os
from mathutils import Vector, Euler
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..")
bpy.ops.wm.read_factory_settings(use_empty=True)
S=bpy.context.scene
HZ=1.62; HR=.30

MATS={}
def hexc(h):return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))
def mat(name,rgb,rough=.55,metal=0):
    if name in MATS:return MATS[name]
    m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value=(*rgb,1);b.inputs["Roughness"].default_value=rough;b.inputs["Metallic"].default_value=metal
    m.diffuse_color=(*rgb,1);MATS[name]=m;return m
def _fin(o,name,m,scale=(1,1,1)):
    o.name=name;o.scale=scale;o.data.materials.append(m);bpy.ops.object.shade_smooth();return o
def sphere(n,loc,r,m,scale=(1,1,1),seg=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=seg//2,radius=r,location=loc);return _fin(bpy.context.object,n,m,scale)
def cyl(n,loc,r,h,m,rot=(0,0,0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=24,radius=r,depth=h,location=loc,rotation=rot);return _fin(bpy.context.object,n,m)
def cone(n,loc,r,h,m,rot=(0,0,0)):
    bpy.ops.mesh.primitive_cone_add(vertices=24,radius1=r,depth=h,location=loc,rotation=rot);return _fin(bpy.context.object,n,m)
def torus(n,loc,R,r,m,rot=(0,0,0)):
    bpy.ops.mesh.primitive_torus_add(major_segments=32,minor_segments=12,major_radius=R,minor_radius=r,location=loc,rotation=rot);return _fin(bpy.context.object,n,m)
def rbox(n,loc,size,m,rot=(0,0,0),round_=.45):
    "rounded box: cube + bevel modifier (applied on export)"
    bpy.ops.mesh.primitive_cube_add(size=2,location=loc,rotation=rot);o=bpy.context.object
    b=o.modifiers.new("b","BEVEL");b.width=round_;b.segments=6;b.use_clamp_overlap=True
    bpy.ops.object.modifier_apply(modifier="b")   # join() drops modifiers of non-active objects, so bake it now
    return _fin(o,n,m,(size[0]/2,size[1]/2,size[2]/2))
def limb(n,p0,p1,r0,r1,m):
    "tapered capsule from p0 to p1"
    p0=Vector(p0);p1=Vector(p1);d=p1-p0
    bpy.ops.mesh.primitive_cone_add(vertices=24,radius1=r0,radius2=r1,depth=d.length,location=(p0+p1)/2)
    o=bpy.context.object;o.rotation_mode="QUATERNION";o.rotation_quaternion=Vector((0,0,1)).rotation_difference(d)
    return [_fin(o,n,m),sphere(n+"0",p0,r0,m,seg=16),sphere(n+"1",p1,r1,m,seg=16)]
K=.68  # metaball visible radius / element radius at threshold .3 (calibrated)
def metaobj(name,m,res=.035):
    bpy.ops.object.metaball_add(type="BALL",location=(0,0,HZ),radius=.001);o=bpy.context.object;o.name=name;o.data.name=name
    o.data.resolution=res;o.data.threshold=.3;o.data.elements.remove(o.data.elements[0]);o.data.materials.append(m);return o
def mball(o,loc,r,neg=False):
    e=o.data.elements.new();e.type="BALL";e.co=(loc[0],loc[1],loc[2]-HZ);e.radius=r/K;e.stiffness=2;e.use_negative=neg;return e
def mell(o,loc,semi,rot=(0,0,0)):
    e=o.data.elements.new();e.type="ELLIPSOID";e.co=(loc[0],loc[1],loc[2]-HZ);e.radius=1;e.stiffness=2
    e.size_x,e.size_y,e.size_z=[a/K for a in semi];e.rotation=Euler(rot).to_quaternion();return e
def mfinish(o):
    bpy.context.view_layer.update();bpy.ops.object.select_all(action="DESELECT");o.select_set(True);bpy.context.view_layer.objects.active=o
    bpy.ops.object.convert(target="MESH");o=bpy.context.object;bpy.ops.object.shade_smooth();return o
def join(parts,name):
    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:p.select_set(True)
    bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();o=bpy.context.object;o.name=name;return o

SKIN={"light":"ffd6bd","tan":"e9ab74","medium":"c47b48","dark":"7b4a2c"}
IRIS={"green":"6fae3a","brown":"7a4b22","blue":"3d8fe0","hazel":"9a7b3a","violet":"b06be0"}
SHOE=["e63946","3d8fe0","ffb32c","2ecc71","ff4d8d","9b5cff","111827","f5f5f5"]

def hand(n,p,kind,d,side,m):
    "mitt + fingers; d=finger direction, side=lateral axis"
    d=Vector(d).normalized();side=Vector(side).normalized();p=Vector(p);P=[sphere(n,p,.055,m,(1,.7,1.1),16)]
    fl=.075
    def finger(off,length=fl,r=.017):P.extend(limb(n+"f",p+side*off+d*.02,p+side*off+d*(.02+length),r,r*.9,m))
    if kind=="peace":finger(-.02);finger(.02)
    elif kind=="rock":finger(-.035);finger(.035)
    elif kind=="open":[finger(o,fl*.9) for o in(-.036,-.012,.012,.036)]
    elif kind=="point":finger(0)
    return P

BROW={"hip":(0,.02),"peace":(.025,0),"rock":(0,.03),"point":(.02,-.005),"wave":(0,.02),"pockets":(-.01,-.01)}
def avatar(name,sex,skin,iris,hair,haircol,body,pants,pose_name,extra,shoe):
    pose=POSES[pose_name]
    sk=mat("skin_"+skin,hexc(SKIN[skin]),.5);hm=mat("hair_"+haircol,hexc(haircol),.45);om=mat("outfit",hexc("e63946"),.6)
    pm=om if pants=="jumpsuit" else mat("pants_"+pants,hexc({"jeans":"3b5fa8","dark":"2b2f3a","khaki":"c9b48a","black":"1b1b22","light":"7fb0e8"}[pants]),.7)
    W=1.25 if body=="chubby" else .92 if body=="slim" else 1.0   # width factor
    P=[]
    # ---- sculpted head (metaballs blend into one smooth surface) ----
    hd=metaobj("mb_head_"+name,sk)
    mell(hd,(0,.01,HZ+.03),(.29,.27,.30))            # skull
    mell(hd,(0,.03,HZ-.15),(.22,.19,.17))            # soft chin, kept behind the skull front
    mball(hd,(0,-.262,HZ-.07),.022)                  # tiny button nose
    hd=mfinish(hd);sc=.60/hd.dimensions.x;hd.scale=(sc,sc,sc);P.append(hd)
    P.append(cyl("neck",(0,0,HZ-.36),.075,.16,sk))
    for s in(-1,1):
        P.append(torus("ear",(s*.3,.02,HZ-.02),.03,.014,sk,rot=(0,math.pi/2,0)));P.append(sphere("earin",(s*.295,.03,HZ-.03),.024,sk,seg=12))
    # ---- eyes: almond eyeball, rimmed iris, pupil, two sparkles, upper + lower lids ----
    im=mat("iris_"+iris,hexc(IRIS[iris]),.3);rim=mat("iris_rim_"+iris,tuple(c*.45 for c in hexc(IRIS[iris])),.3)
    dk=mat("dark",(.07,.06,.09),.35);wh=mat("eye_white",(1,1,1),.15)
    raise_=BROW.get(pose_name,(0,0))
    for i,s in enumerate((-1,1)):
        ex=s*.12
        P.append(sphere("eye",(ex,-.236,HZ+.005),.09,wh,(1.2,.5,1.05)))   # shallow lens, just proud of the face
        P.append(sphere("rim",(s*.115,-.274,HZ-.005),.06,rim,(1,.45,1)))
        P.append(sphere("iris",(s*.115,-.278,HZ-.005),.055,im,(1,.45,1)))
        P.append(sphere("pupil",(s*.115,-.296,HZ-.005),.028,dk,seg=12))
        P.append(sphere("shine",(s*.115-.02,-.314,HZ+.016),.015,wh,seg=10));P.append(sphere("shine2",(s*.115+.018,-.308,HZ-.02),.007,wh,seg=8))
        if sex=="f":P.append(rbox("lash",(s*.19,-.255,HZ+.06),(.05,.02,.014),dk,rot=(0,0,s*.5)))
        P.append(sphere("blush",(s*.19,-.215,HZ-.09),1,mat("blush",hexc("ff9aa8"),.9),(.04,.012,.024),12))
        # arched brow: 4 blended balls, per-pose raise for expression
        br=metaobj("mb_brow%d_"%i+name,hm,res=.01);rz=raise_[i]
        for t,(x,z) in enumerate([(.05,.115),(.08,.135),(.11,.148),(.14,.152),(.17,.148),(.2,.135)]):
            mball(br,(s*x,-.245+.006*t,HZ+z+rz),.017)
        P.append(mfinish(br))
    # ---- mouth: smile line + lower lip ----
    P.append(torus("smile",(0,-.215,HZ-.15),.07,.011,mat("mouth",(.55,.18,.22),.5),rot=(math.radians(55),0,0)))
    # ---- hair: blended metaball clumps ----
    hr=metaobj("mb_hair_"+name,hm,res=.045)
    def cap(semi=(.32,.30,.26),loc=(0,.06,HZ+.12)):mell(hr,loc,semi)
    def fringe(x=0,z=.24,semi=(.25,.08,.06),ry=0,rz=0):mell(hr,(x,-.2,HZ+z),semi,(0,ry,rz))
    if hair=="swept":
        cap();fringe(-.05,.25,(.22,.09,.06),0,.35);mell(hr,(-.24,-.1,HZ+.18),(.08,.14,.1))
    elif hair=="messy":
        cap()
        for (x,y,ry,rz) in [(-.16,-.02,.6,.4),(0,-.08,.2,-.3),(.16,-.02,-.6,-.5),(-.07,.12,.9,1.2),(.1,.12,-.9,-1.4),(0,-.18,.5,0)]:mell(hr,(x,y,HZ+.34),(.11,.06,.05),(0,ry,rz))
    elif hair=="curly":
        cap((.3,.28,.24))
        for i in range(16):
            a=i/16*math.tau;z=.22 if i%2 else .34;r_=.3 if i%2 else .2;mball(hr,(math.cos(a)*r_,math.sin(a)*r_*.9+.06,HZ+z),.085)
    elif hair=="quiff":cap();mell(hr,(0,-.12,HZ+.36),(.2,.12,.11),(.5,0,0))
    elif hair=="long":
        cap((.33,.31,.27));fringe(0,.24,(.24,.08,.06),0,.15)
        for s in(-1,1):mell(hr,(s*.28,.05,HZ-.15),(.09,.16,.32))
        mell(hr,(0,.28,HZ-.12),(.28,.1,.32))
    elif hair=="ponytail":
        cap();mball(hr,(0,.2,HZ+.3),.09)
        for t,(y,z,r_) in enumerate([(.26,.22,.075),(.32,.1,.065),(.36,-.03,.055),(.38,-.16,.045)]):mball(hr,(0,y,HZ+z),r_)
    elif hair=="bob":
        cap((.36,.33,.29),(0,.06,HZ+.06));fringe(0,.24,(.28,.09,.06))
        for s in(-1,1):mell(hr,(s*.29,.06,HZ-.12),(.1,.2,.16))
    elif hair=="bun":
        cap();fringe(.05,.24,(.24,.08,.06),0,-.3);mball(hr,(0,.2,HZ+.32),.11)
        P.append(sphere("bow",(-.1,.2,HZ+.38),1,mat("bow",hexc("e63946"),.6),(.06,.03,.04)));P.append(sphere("bow2",(.1,.2,HZ+.38),1,mat("bow",hexc("e63946"),.6),(.06,.03,.04)))
    P.append(mfinish(hr))
    # torso / top
    tw=.5*W;shoulder=Vector((tw/2,0,1.2))
    P.append(rbox("top",(0,0,1.06),(tw,.28*W,.44),om))
    if extra=="hoodie":P.append(torus("hood",(0,.1,1.26),.16,.07,om,rot=(math.radians(60),0,0)));P.append(rbox("pocket",(0,-.14,.94),(.3,.06,.14),om))
    if extra=="jacket":
        jm=mat("jacket",hexc("ff4d8d" if sex=="f" else "1b1b22"),.6)
        for s in(-1,1):P.append(rbox("panel",(s*tw*.32,-.03,1.06),(tw*.3,.3*W,.46),jm))
    # arms
    for s,(E,Wr,kind,d,side) in zip((-1,1),pose["arms"]):
        Sh=Vector((s*shoulder.x,0,shoulder.z));E=Vector((s*E[0],E[1],E[2]));Wr=Vector((s*Wr[0],Wr[1],Wr[2]))
        sl=(Sh+E)/2;P.append(cyl("sleeve",(Sh+ (E-Sh).normalized()*.1),.075*W,.2,om,rot=(0,0,0)));P[-1].rotation_mode="QUATERNION";P[-1].rotation_quaternion=Vector((0,0,1)).rotation_difference(E-Sh)
        P.extend(limb("uarm",Sh,E,.048*W,.042*W,sk));P.extend(limb("farm",E,Wr,.042*W,.036*W,sk))
        P.extend(hand("hand",Wr,kind,(s*d[0],d[1],d[2]),(s*side[0],side[1],side[2]),sk))
    # pants + legs
    P.append(rbox("hips",(0,0,.8),(tw*.86,.26*W,.22),pm))
    lr=(.1 if pants in("khaki","jumpsuit") else .08)*W
    for s,(K,A) in zip((-1,1),pose["legs"]):
        H=Vector((s*.11*W,0,.78));K=Vector((s*K[0],K[1],K[2]));A=Vector((s*A[0],A[1],A[2]))
        P.extend(limb("thigh",H,K,lr,lr*.9,pm));P.extend(limb("shin",K,A,lr*.9,lr*(1.1 if pants=="khaki" else .85),pm))
        if pants=="khaki":P.append(rbox("cargo",(s*.2*W,-.02,.55),(.09,.14,.12),pm))
        sm=mat("shoe_"+shoe,hexc(shoe),.5);P.append(rbox("shoe",(A.x,-.05,.075),(.15,.3,.11),sm));P.append(rbox("sole",(A.x,-.05,.025),(.16,.32,.04),mat("sole",(.96,.96,.96),.4)))
        P.append(rbox("lace",(A.x,-.12,.11),(.1,.1,.03),mat("sole",(.96,.96,.96),.4)))
    o=join(P,name);o.rotation_euler=(0,0,pose.get("turn",0));return o

# poses: arms=[(elbow,wrist,hand,fingerdir,side) for left,right] (x mirrored per side), legs=[(knee,ankle)]
DOWN=((.3,.0,.95),(.33,-.03,.68),"fist",(0,0,-1),(1,0,0))
HIP=((.36,.0,.98),(.2,-.05,.82),"fist",(0,0,-1),(1,0,0))
POSES={
 "relaxed":{"arms":[DOWN,DOWN],"legs":[((.12,-.01,.45),(.13,0,.12)),((.12,-.01,.45),(.13,0,.12))],"turn":.15},
 "hip":{"arms":[DOWN,HIP],"legs":[((.12,-.01,.45),(.16,0,.12)),((.12,-.01,.45),(.1,0,.12))],"turn":-.2},
 "pockets":{"arms":[((.32,-.04,.95),(.12,-.16,.9),"fist",(0,-1,0),(1,0,0)),((.32,-.04,.95),(.12,-.16,.9),"fist",(0,-1,0),(1,0,0))],"legs":[((.12,-.01,.45),(.18,0,.12)),((.12,-.01,.45),(.18,0,.12))]},
 "peace":{"arms":[DOWN,((.4,-.08,1.12),(.36,-.18,1.45),"peace",(0,-.2,1),(1,0,0))],"legs":[((.12,-.01,.45),(.13,0,.12)),((.12,-.01,.45),(.13,0,.12))],"turn":.1},
 "wave":{"arms":[((.42,0,1.15),(.46,-.05,1.5),"open",(0,-.3,1),(1,0,0)),DOWN],"legs":[((.12,-.01,.45),(.13,0,.12)),((.12,-.01,.45),(.13,0,.12))],"turn":-.1},
 "hips2":{"arms":[HIP,HIP],"legs":[((.12,-.01,.45),(.2,0,.12)),((.12,-.01,.45),(.2,0,.12))]},
 "point":{"arms":[DOWN,((.3,-.2,1.05),(.28,-.45,1.1),"point",(0,-1,.1),(1,0,0))],"legs":[((.12,-.01,.45),(.13,0,.12)),((.12,-.01,.45),(.13,0,.12))],"turn":.2},
 "rock":{"arms":[((.36,-.1,1.0),(.3,-.3,1.15),"rock",(0,-.6,.8),(1,0,0)),((.36,0,1.15),(.24,-.05,1.5),"fist",(0,0,1),(1,0,0))],"legs":[((.12,-.01,.45),(.16,0,.12)),((.12,-.01,.45),(.1,0,.12))],"turn":-.15},
}
AV=[("avatar_m1","m","light","green","swept","1d1b22","chubby","khaki","relaxed","","e63946"),
    ("avatar_m2","m","tan","brown","messy","2a1d14","slim","dark","hip","","3d8fe0"),
    ("avatar_m3","m","dark","brown","curly","111111","avg","jeans","pockets","hoodie","ffb32c"),
    ("avatar_m4","m","medium","hazel","quiff","5a3416","avg","black","peace","jacket","f5f5f5"),
    ("avatar_f1","f","light","brown","long","1d1b22","slim","jeans","wave","","9b5cff"),
    ("avatar_f2","f","dark","violet","ponytail","111111","avg","jumpsuit","hips2","","ff4d8d"),
    ("avatar_f3","f","medium","blue","bob","3b2a20","slim","light","point","jacket","2ecc71"),
    ("avatar_f4","f","tan","hazel","bun","6b3a1e","avg","dark","rock","hoodie","111827")]
avatars=[avatar(*a) for a in AV]

# accessories around the shared head (HR=.30 at HZ)
dark=mat("glass_dark",(.05,.05,.08),.15);gold=mat("metal_gold",hexc("ffb32c"),.3,.8);black=mat("cap_black",(.08,.08,.1),.6)
hp=mat("headphone",hexc("ff4d8d"),.4)
acc=[join([torus("band",(0,.02,HZ+.06),.36,.03,hp,rot=(math.pi/2,0,0)),cyl("cupL",(-.34,.02,HZ),.1,.07,hp,rot=(0,math.pi/2,0)),cyl("cupR",(.34,.02,HZ),.1,.07,hp,rot=(0,math.pi/2,0))],"acc_music"),
 join([rbox("lensL",(-.11,-.3,HZ+.04),(.13,.03,.08),dark),rbox("lensR",(.11,-.3,HZ+.04),(.13,.03,.08),dark),rbox("bridge",(0,-.3,HZ+.05),(.08,.02,.02),dark)],"acc_sense"),
 join([torus("rimL",(-.11,-.3,HZ+.03),.085,.008,black,rot=(math.pi/2,0,0)),torus("rimR",(.11,-.3,HZ+.03),.085,.008,black,rot=(math.pi/2,0,0)),rbox("bridge",(0,-.3,HZ+.04),(.06,.015,.015),black)],"acc_smart"),
 join([cyl("base",(0,.02,HZ+.36),.24,.08,black),rbox("board",(0,.02,HZ+.41),(.5,.5,.02),black,rot=(0,0,math.pi/4)),cyl("tassel",(.24,.02,HZ+.3),.01,.22,gold),sphere("tip",(.24,.02,HZ+.19),.025,gold,seg=8)],"acc_knowledge"),
 join([cone("hornL",(-.2,0,HZ+.34),.06,.22,mat("horn",hexc("8b1a4a"),.5),rot=(0,-.4,0)),cone("hornR",(.2,0,HZ+.34),.06,.22,mat("horn",hexc("8b1a4a"),.5),rot=(0,.4,0))],"acc_crazy"),
 join([cyl("ring",(0,.02,HZ+.37),.21,.1,gold)]+[cone("pt",(math.cos(i/5*math.tau)*.2,.02+math.sin(i/5*math.tau)*.2,HZ+.48),.05,.12,gold) for i in range(5)],"acc_leader"),
 join([cone("cap",(.08,.03,HZ+.5),.3,.45,mat("nightcap",hexc("2a2b6b"),.7),rot=(0,.35,0)),sphere("pom",(.25,.03,HZ+.75),.08,mat("pom",(1,1,1),.8))],"acc_chill"),
 join([rbox("cape",(0,.2,.95),(.58,.04,.72),mat("cape",hexc("38e8ff"),.5)),torus("collar",(0,0,1.29),.13,.03,mat("cape",hexc("38e8ff"),.5))],"acc_dress")]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,"avatars.glb"),export_format="GLB",use_selection=True,export_apply=True,export_yup=True)

# preview render: line up, each wearing one attribute
for i,(a,c) in enumerate(zip(avatars,acc)):
    x=(i-3.5)*1.15;a.location.x=x;c.location.x=x
bpy.ops.object.camera_add(location=(0,-11.5,1.3),rotation=(math.radians(88),0,0));S.camera=bpy.context.object;bpy.context.object.data.lens=38
bpy.ops.object.light_add(type="AREA",location=(3,-6,6),rotation=(math.radians(45),math.radians(15),0));bpy.context.object.data.energy=2500;bpy.context.object.data.size=6
bpy.ops.object.light_add(type="AREA",location=(-5,-4,3),rotation=(math.radians(60),math.radians(-40),0));bpy.context.object.data.energy=900;bpy.context.object.data.size=6
bpy.ops.mesh.primitive_plane_add(size=40,location=(0,0,0));bpy.context.object.data.materials.append(mat("floor",(.55,.55,.57),.9))
w=bpy.data.worlds.new("w");S.world=w;w.use_nodes=True;w.node_tree.nodes["Background"].inputs[0].default_value=(.6,.6,.62,1);w.node_tree.nodes["Background"].inputs[1].default_value=.5
S.render.engine="BLENDER_EEVEE"
S.render.resolution_x=1800;S.render.resolution_y=560
S.render.filepath=os.path.join(OUT,"blender","preview.png");bpy.ops.render.render(write_still=True)
bpy.ops.object.camera_add(location=(0,-6,HZ+.02),rotation=(math.radians(90),0,0));fc=bpy.context.object;fc.data.type="ORTHO";fc.data.ortho_scale=9.6;S.camera=fc
S.render.resolution_x=2000;S.render.resolution_y=420;S.render.filepath=os.path.join(OUT,"blender","faces.png");bpy.ops.render.render(write_still=True)
print("DONE avatars=%d accs=%d"%(len(avatars),len(acc)))
