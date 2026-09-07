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
def hexc(h):
    def linear(v):return v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4
    return tuple(linear(int(h[i:i+2],16)/255) for i in (0,2,4))
def mat(name,rgb,rough=.55,metal=0):
    if name in MATS:return MATS[name]
    m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value=(*rgb,1);b.inputs["Roughness"].default_value=rough;b.inputs["Metallic"].default_value=metal
    m.diffuse_color=(*rgb,1);MATS[name]=m;return m
def _fin(o,name,m,scale=(1,1,1)):
    o.name=name;o.scale=scale;o.data.materials.append(m);bpy.ops.object.shade_smooth();return o
def sphere(n,loc,r,m,scale=(1,1,1),seg=20):
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
def join(parts,name):
    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:p.select_set(True)
    bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();o=bpy.context.object;o.name=name;bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type="ORIGIN_CURSOR");bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);return o

# Mesh lofts keep cheeks, garments and limbs continuous rather than stacked primitives.
def loft(n,rings,m,segments=32):
    if rings[0][2]>rings[-1][2]:rings=list(reversed(rings))
    verts=[]
    for x,y,z,rx,ry in rings:
        verts.extend((x+rx*math.cos(i*math.tau/segments),y+ry*math.sin(i*math.tau/segments),z) for i in range(segments))
    faces=[]
    for j in range(len(rings)-1):
        for i in range(segments):
            a=j*segments+i;b=j*segments+(i+1)%segments;faces.append((a,b,b+segments,a+segments))
    faces.extend([tuple(reversed(range(segments))),tuple((len(rings)-1)*segments+i for i in range(segments))])
    me=bpy.data.meshes.new(n);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(n,me);S.collection.objects.link(o);o.data.materials.append(m)
    for f in me.polygons:f.use_smooth=True
    sub=o.modifiers.new('soft tailoring','SUBSURF');sub.levels=1
    bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.modifier_apply(modifier=sub.name);o.select_set(False);return o

def stroke(n,pts,r,m,radii=None):
    cu=bpy.data.curves.new(n,'CURVE');cu.dimensions='3D';cu.resolution_u=5;cu.bevel_depth=r;cu.bevel_resolution=2
    sp=cu.splines.new('BEZIER');sp.bezier_points.add(len(pts)-1)
    for i,(bp,p) in enumerate(zip(sp.bezier_points,pts)):
        bp.co=p;bp.handle_left_type='AUTO';bp.handle_right_type='AUTO';bp.radius=radii[i] if radii else 1
    o=bpy.data.objects.new(n,cu);S.collection.objects.link(o);cu.materials.append(m);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False);return o

def sleeve(n,p0,p1,r0,r1,m):
    # A single smoothly tapered sleeve or limb, with no exposed joint balls.
    p0=Vector(p0);p1=Vector(p1);d=p1-p0
    o=loft(n,[(0,0,t*d.length,r0*(1-t)+r1*t,r0*(1-t)+r1*t) for t in (0,.08,.35,.7,.94,1)],m,20)
    o.rotation_mode='QUATERNION';o.rotation_quaternion=Vector((0,0,1)).rotation_difference(d);o.location=p0;return o

SKIN={"light":"f2c6ae","tan":"dba077","medium":"b97751","dark":"77462e"}
IRIS={"green":"738645","brown":"644431","blue":"507e91","hazel":"89704b","violet":"80618c"}
def avatar(name,sex,skin,iris,hair,haircol,body,pants,pose_name,extra,shoe):
    sk=mat('skin_'+skin,hexc(SKIN[skin]),.48);hm=mat('hair_'+haircol,hexc(haircol),.72)
    idx=int(name[-1])-1+(4 if sex=='f' else 0)
    # Vertex color is multiplied by the shared outfit tint in glTF/Three.
    om=mat('outfit',hexc('ffffff'),.7)
    if not om.node_tree.nodes.get('Wardrobe colors'):
        vc=om.node_tree.nodes.new('ShaderNodeVertexColor');vc.name='Wardrobe colors';vc.layer_name='Color';om.node_tree.links.new(vc.outputs['Color'],om.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
    pm=om if pants=='jumpsuit' else mat('pants_'+pants,hexc({'jeans':'34465e','dark':'30343a','khaki':'aa9379','black':'24272b','light':'6488a3'}[pants]),.85)
    seam=mat('stitch',hexc('c0b8a7'),.8);white=mat('eye_white',hexc('fff9f1'),.23);dk=mat('dark',hexc('201e24'),.4)
    W=1.14 if body=='chubby' else .90 if body=='slim' else 1
    P=[loft('sculpted cheek and chin',[(0,.025,HZ+z,rx,ry) for z,rx,ry in [(-.30,.055,.07),(-.275,.13,.13),(-.22,.22,.19),(-.12,.28,.235),(0,.30,.255),(.12,.285,.25),(.23,.225,.20),(.29,.12,.11),(.31,.012,.012)]],sk)]
    P.append(sleeve('neck',(0,.015,1.22),(0,.015,1.39),.067,.065,sk))
    for sign in (-1,1):
        P.append(sphere('ear',(sign*.294,.015,HZ-.025),1,sk,(.042,.045,.075)))
        P.append(sphere('inner ear',(sign*.31,-.022,HZ-.025),1,mat('ear_'+skin,hexc(SKIN[skin]),.7),(.019,.012,.041)))
    im=mat('iris_'+iris,hexc(IRIS[iris]),.3)
    for sign in (-1,1):
        x=sign*.116
        P.append(sphere('inset eye',(x,-.218,HZ+.005),1,white,(.094,.024,.063)))
        P.append(sphere('iris',(x,-.240,HZ+.002),1,im,(.043,.010,.046)))
        P.append(sphere('pupil',(x,-.248,HZ+.003),1,dk,(.024,.006,.029)))
        P.append(sphere('catchlight',(x-.013,-.254,HZ+.021),.010,white,seg=12))
        P.append(stroke('upper eyelid',[(x-.085,-.232,HZ+.008),(x-.055,-.255,HZ+.066),(x+.025,-.258,HZ+.075),(x+.084,-.231,HZ+.015)],.009,sk,[.4,1,1,.3]))
        P.append(stroke('eyebrow',[(x-.075,-.218,HZ+.121),(x-.018,-.244,HZ+.143),(x+.065,-.217,HZ+.133)],.015,hm,[.6,1,.45]))
    P.append(sphere('nose bridge',(0,-.245,HZ-.053),1,sk,(.032,.035,.064)))
    P.append(sphere('nose tip',(0,-.272,HZ-.084),1,sk,(.041,.034,.028)))
    lip=mat('lips_'+skin,hexc({'light':'b97670','tan':'985c51','medium':'80453e','dark':'51302b'}[skin]),.6)
    P.append(stroke('relaxed smile',[(-.072,-.202,HZ-.160),(-.038,-.218,HZ-.179),(0,-.223,HZ-.184),(.041,-.216,HZ-.176),(.074,-.200,HZ-.155)],.006,lip,[.25,.8,1,.8,.25]))
    # Back/side cap follows scalp; the forehead opening is cut into the actual surface.
    verts=[];faces=[];N=64;R=12
    for j in range(R):
        t=j/(R-1)
        for i in range(N):
            a=i*math.tau/N;front=max(0,-math.sin(a));end=1.95-.91*front
            ph=.02+t*end
            verts.append((.313*math.sin(ph)*math.cos(a),.026+.274*math.sin(ph)*math.sin(a),HZ+.025+.316*math.cos(ph)))
    for j in range(R-1):
        for i in range(N):a=j*N+i;b=j*N+(i+1)%N;faces.append((a,b,b+N,a+N))
    me=bpy.data.meshes.new('hair cap');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('hair cap',me);S.collection.objects.link(o);o.data.materials.append(hm)
    for f in me.polygons:f.use_smooth=True
    P.append(o)
    if hair=='curly':
        for j in range(3):
            for i in range(11):
                a=i/11*math.tau+j*.3;r=.27-j*.07
                P.append(stroke('curl',[(r*math.cos(a),.025+r*.8*math.sin(a),HZ+.22+j*.055),((r+.025)*math.cos(a+.2),.025+(r+.02)*.8*math.sin(a+.2),HZ+.30+j*.04),(r*math.cos(a+.5),.025+r*.8*math.sin(a+.5),HZ+.27+j*.05)],.044,hm,[.6,1,.55]))
    else:
        for i in range(12):
            u=i/11;x=-.28+u*.56;crown=math.sqrt(max(.04,1-(x/.33)**2))
            boost=.035*math.sin(math.pi*u) if hair in ('quiff','messy') else 0
            if hair=='messy':boost+=.024*math.sin(i*2.4)
            if hair in ('long','bob','ponytail','bun'):
                sign=-1 if x<0 else 1
                pts=[(x*.25,.025,HZ+.335),(x*.73,-.14,HZ+.29*crown),(x*.97,-.22*crown,HZ+.205),(sign*.285,-.10,HZ+(.04 if hair=='bob' else .11))]
            else:
                pts=[(x*.8,.16,HZ+.21*crown),(x*.92+.018,.035,HZ+.307*crown+boost),(x*.88+.008,-.14,HZ+.261*crown+boost*.6),(x*.8-.024,-.239*crown,HZ+.151+.055*u)]
            P.append(stroke('scalp following swept lock',pts,.025,hm,[.45,1,1,.025]))
    if hair in ('long','bob'):
        length=.49 if hair=='long' else .26
        for i in range(15):
            a=.05+i/14*(math.pi-.1)
            x=.295*math.cos(a);y=.05+.23*math.sin(a)
            P.append(stroke('flowing hair',[(x*.85,y,HZ+.19),(x,y,HZ-.08),(x*1.08,y+.02,HZ-length)],.052,hm,[.8,1,.25]))
    if hair=='ponytail':
        for i in range(7):
            x=(i-3)*.027
            P.append(stroke('ponytail',[(x,.21,HZ+.26),(x,.36,HZ+.1),(x+.025,.38,HZ-.21),(x+.06,.29,HZ-.35)],.04,hm,[1,1,.8,.1]))
    if hair=='bun':
        for i in range(7):
            a=i/7*math.tau
            P.append(stroke('bun twist',[(.09*math.cos(a),.12,HZ+.29),(.11*math.cos(a),.20+.09*math.sin(a),HZ+.40),(.035*math.cos(a),.24,HZ+.45)],.039,hm,[.8,1,.3]))
    tw=.245*W
    P.append(loft('tailored tee',[(0,0,z,rx*W,ry) for z,rx,ry in [(.81,.205,.132),(.83,.217,.14),(.93,.209,.137),(1.09,.226,.14),(1.20,.252,.135),(1.245,.19,.105),(1.275,.078,.07)]],om))
    P.append(torus('ribbed collar',(0,0,1.271),.076,.009,seam))
    P.append(loft('pants waist',[(0,0,z,.203*W,ry) for z,ry in [(.72,.12),(.77,.136),(.85,.132),(.87,.125)]],pm))
    P.append(stroke('hem',[(-.18*W,-.082,.836),(0,-.143,.836),(.18*W,-.082,.836)],.003,seam))
    pose=POSES[pose_name]
    for sign,(E,Wr,kind,d,side) in zip((-1,1),pose['arms']):
        Sh=Vector((sign*tw*.78,0,1.19));E=Vector((sign*E[0],E[1],E[2]));Wr=Vector((sign*Wr[0],Wr[1],Wr[2]));end=Sh+(E-Sh)*.65
        P.append(sphere('shoulder',Sh,1,sk if pants=='jumpsuit' else om,(.075 if pants=='jumpsuit' else .098*W,.077 if pants=='jumpsuit' else .105,.075)));P.append(sleeve('short sleeve',Sh,end,.065 if pants=='jumpsuit' else .093*W,.061 if pants=='jumpsuit' else .073*W,sk if pants=='jumpsuit' else om));P.append(sleeve('arm',end,E,.064*W,.052*W,sk));P.append(sphere('elbow',E,.054*W,sk));P.append(sleeve('forearm',E,Wr,.052*W,.034*W,sk))
        P.append(sphere('palm',Wr,1,sk,(.044,.032,.055)))
        direction=Vector((sign*d[0],d[1],d[2])).normalized()
        for k in range(4):
            p=Wr+Vector(((k-1.5)*.017,0,0));length=.07 if kind in ('peace','open') and (kind=='open' or k in (1,2)) else .038
            P.append(stroke('finger',[p,p+direction*length*.55,p+direction*length+Vector((0,-.005,0))],.009,sk,[1,1,.7]))
        P.append(sphere('thumb',Wr+Vector((sign*.032,-.015,-.018)),1,sk,(.018,.018,.032)))
    for sign,(K,A) in zip((-1,1),pose['legs']):
        K=Vector((sign*K[0],K[1],K[2]));A=Vector((sign*A[0],A[1],A[2]));H=Vector((sign*.105*W,0,.78));wide=pants in ('khaki','jumpsuit')
        rings=[]
        for z,t in [(.80,0),(.76,.05),(.64,.25),(.46,.5),(.30,.74),(.155,.98),(.145,1)]:
            c=H.lerp(A,t);r=(.109 if wide else .092)*W*(1-.22*t);rings.append((c.x,c.y,z,r,r*.97))
        P.append(loft('continuous trouser leg',rings,pm,24))
        if pants=='khaki':P.append(rbox('cargo pocket',(sign*.205*W,-.065,.58),(.075,.12,.14),pm,round_=.18))
        P.append(sphere('sock',(A.x,0,.145),1,white,(.060,.058,.04)))
        P.append(rbox('sneaker',(A.x,-.055,.081),(.172,.302,.127),mat('shoe_'+shoe,hexc(shoe),.6),round_=.65))
        P.append(rbox('rubber sole',(A.x,-.059,.032),(.182,.319,.049),mat('sole',hexc('e4e0d8'),.8),round_=.35))
        for z in range(3):P.append(stroke('lace',[(A.x-.04,-.14+z*.03,.153),(A.x+.04,-.13+z*.03,.153)],.004,white))
    if extra=='hoodie':
        P.append(torus('soft hood',(0,.08,1.245),.115,.046,om,rot=(.65,0,0)))
        P.append(rbox('kangaroo pocket',(0,-.139,.948),(.26,.025,.115),om,round_=.55))
        for sign in (-1,1):P.append(stroke('hood drawstring',[(sign*.067,-.105,1.24),(sign*.060,-.147,1.12)],.005,seam))
    if extra=='jacket':
        P.append(rbox('white inner tee',(0,-.151,1.04),(.125,.027,.39),white,round_=.15))
        for sign in (-1,1):
            P.append(stroke('jacket opening',[(sign*.075,-.111,1.24),(sign*.08,-.157,1.06),(sign*.075,-.14,.85)],.011,om))
            P.append(rbox('folded jacket lapel',(sign*.08,-.125,1.207),(.075,.022,.105),om,rot=(0,sign*.4,0),round_=.15))
        P.append(sphere('zip pull',(.082,-.165,1.05),.011,mat('silver',hexc('c3c7c9'),.3,.8)))
    if pants=='jumpsuit':
        for x in (-.15,-.10,-.05,0,.05,.10,.15):
            P.append(stroke('jumpsuit stripe',[(x,-.14*math.sqrt(1-(x/.24)**2),.86),(x,-.143*math.sqrt(1-(x/.24)**2),1.08),(x,-.124*math.sqrt(1-(x/.24)**2),1.225)],.008,white))
        for sign in (-1,1):
            for off in (-.035,0,.035):P.append(stroke('trouser stripe',[(sign*.105+off,-.098,.75),(sign*.15+off,-.092,.46),(sign*.20+off,-.075,.16)],.007,white))
    if sex=='f':
        P.append(torus('ear hoop',(-.316,-.014,HZ-.078),.022,.004,mat('gold jewelry',hexc('c8a36b'),.3,.8),rot=(math.pi/2,0,0)))
    o=join(P,name)
    colors=['c5bca9','697b70','5f7286','a45c48','a46c80','b68183','bc4e51','797687']
    # Shared tint hook retains individual, authored wardrobe palettes.
    attr=o.data.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='CORNER')
    for poly in o.data.polygons:
        col=hexc(colors[idx]) if o.data.materials[poly.material_index]==om else (1,1,1)
        for li in poly.loop_indices:attr.data[li].color=(*col,1)
    return o

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
acc=[join([stroke("band",[(.35*math.cos(t),.035,HZ+.035+.35*math.sin(t)) for t in [i*math.pi/12 for i in range(13)]],.026,hp),cyl("cupL",(-.34,.02,HZ),.1,.07,hp,rot=(0,math.pi/2,0)),cyl("cupR",(.34,.02,HZ),.1,.07,hp,rot=(0,math.pi/2,0))],"acc_music"),
 join([rbox("lensL",(-.11,-.3,HZ+.04),(.13,.03,.08),dark),rbox("lensR",(.11,-.3,HZ+.04),(.13,.03,.08),dark),rbox("bridge",(0,-.3,HZ+.05),(.08,.02,.02),dark)],"acc_sense"),
 join([torus("rimL",(-.11,-.3,HZ+.03),.085,.008,black,rot=(math.pi/2,0,0)),torus("rimR",(.11,-.3,HZ+.03),.085,.008,black,rot=(math.pi/2,0,0)),rbox("bridge",(0,-.3,HZ+.04),(.06,.015,.015),black)],"acc_smart"),
 join([cyl("base",(0,.02,HZ+.36),.24,.08,black),rbox("board",(0,.02,HZ+.41),(.5,.5,.02),black,rot=(0,0,math.pi/4)),cyl("tassel",(.24,.02,HZ+.3),.01,.22,gold),sphere("tip",(.24,.02,HZ+.19),.025,gold,seg=8)],"acc_knowledge"),
 join([cone("hornL",(-.2,0,HZ+.34),.06,.22,mat("horn",hexc("8b1a4a"),.5),rot=(0,-.4,0)),cone("hornR",(.2,0,HZ+.34),.06,.22,mat("horn",hexc("8b1a4a"),.5),rot=(0,.4,0))],"acc_crazy"),
 join([cyl("ring",(0,.02,HZ+.37),.21,.1,gold)]+[cone("pt",(math.cos(i/5*math.tau)*.2,.02+math.sin(i/5*math.tau)*.2,HZ+.48),.05,.12,gold) for i in range(5)],"acc_leader"),
 join([cone("cap",(.08,.03,HZ+.5),.3,.45,mat("nightcap",hexc("2a2b6b"),.7),rot=(0,.35,0)),sphere("pom",(.25,.03,HZ+.75),.08,mat("pom",(1,1,1),.8))],"acc_chill"),
 join([rbox("cape",(0,.2,.95),(.58,.04,.72),mat("cape",hexc("38e8ff"),.5)),torus("collar",(0,0,1.29),.13,.03,mat("cape",hexc("38e8ff"),.5))],"acc_dress")]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,"avatars.glb"),export_format="GLB",use_selection=True,export_apply=True,export_yup=True)

# Clean review renders, accessories hidden; export retains all independent roots.
for c in acc:c.hide_render=True
for i,a in enumerate(avatars):
    a.location.x=(i-3.5)*.94;a.rotation_euler.z=POSES[AV[i][8]].get('turn',0)
bpy.ops.object.camera_add(location=(0,-10,2.5));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1.03))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=8.1;S.camera=cam
for loc,power,size in [((-3,-4,6),700,5),((4,-2,4),450,4),((0,3,5),800,4)]:
    bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.mesh.primitive_plane_add(size=200);bpy.context.object.data.materials.append(mat('floor',hexc('c6c4bf'),.9))
w=bpy.data.worlds.new('studio');S.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(.3,.3,.3,1);w.node_tree.nodes['Background'].inputs[1].default_value=.4
S.render.engine='CYCLES';S.cycles.samples=32;S.cycles.use_denoising=True
S.view_settings.view_transform='AgX';S.render.resolution_percentage=100;S.render.resolution_x=2400;S.render.resolution_y=760
S.render.filepath=os.path.join(OUT,'blender','preview.png');bpy.ops.render.render(write_still=True)
cam.location=(0,-8,HZ+.06);cam.rotation_euler=(math.pi/2,0,0);cam.data.ortho_scale=7.7
S.render.resolution_x=2800;S.render.resolution_y=420;S.render.filepath=os.path.join(OUT,'blender','faces.png');bpy.ops.render.render(write_still=True)
# Geometry evidence, captured before the display offsets are restored.
for i,a in enumerate(avatars):a.location.x=0;a.rotation_euler.z=0
for o in avatars+acc:
    assert all(math.isfinite(v) for p in o.bound_box for v in p)
    assert o.location.length<1e-6,(o.name,o.location[:])
print('ASSET_ROOTS',[(o.name,tuple(round(v,4) for v in o.dimensions)) for o in avatars+acc])
print('MATERIAL_HOOKS',[n for n in ('outfit','headphone','cape') if n in MATS])
print('GLB_BYTES',os.path.getsize(os.path.join(OUT,'avatars.glb')))
for i,a in enumerate(avatars):
    a.location.x=(i-3.5)*.94;a.rotation_euler.z=POSES[AV[i][8]].get('turn',0)
cam.location=(0,-10,2.5);cam.rotation_euler=(Vector((0,0,1.03))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=8.1
S.render.resolution_x=2400;S.render.resolution_y=760
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'blender','avatars.blend'))
# Additional fit sheet: every base with headphones and one attribute.
fit_copies=[]
for i,(a,c) in enumerate(zip(avatars,acc)):
    c.hide_render=False;c.location.x=a.location.x;c.rotation_euler.z=a.rotation_euler.z
    if i:
        hp=acc[0].copy();hp.data=hp.data.copy();S.collection.objects.link(hp)
        hp.location.x=a.location.x;hp.rotation_euler.z=a.rotation_euler.z;hp.hide_render=False;fit_copies.append(hp)
S.render.resolution_y=860;S.cycles.samples=24
S.render.filepath=os.path.join(OUT,'blender','accessories.png');bpy.ops.render.render(write_still=True)
for hp in fit_copies:bpy.data.objects.remove(hp,do_unlink=True)
for c in acc:c.hide_render=True;c.location=(0,0,0);c.rotation_euler=(0,0,0)
print('DONE avatars=%d accs=%d'%(len(avatars),len(acc)))
