# Generates 8 chibi avatars (4 male, 4 female) + 8 attribute accessories, exports avatars.glb
# and renders a preview PNG. Run: Blender -b --python blender/make_avatars.py
# All avatars share the same head centre (0,0,1.5) r=.42 so every accessory fits every avatar.
import bpy, math, os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..")
bpy.ops.wm.read_factory_settings(use_empty=True)
S=bpy.context.scene

MATS={}
def mat(name,rgb,rough=.6,metal=0):
    if name in MATS:return MATS[name]
    m=bpy.data.materials.new(name);m.use_nodes=True
    b=m.node_tree.nodes["Principled BSDF"];b.inputs["Base Color"].default_value=(*rgb,1);b.inputs["Roughness"].default_value=rough;b.inputs["Metallic"].default_value=metal;m.diffuse_color=(*rgb,1)
    MATS[name]=m;return m
def hexc(h):return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))
def prim(kind,name,loc,mat_,scale=(1,1,1),rot=(0,0,0),**kw):
    getattr(bpy.ops.mesh,"primitive_%s_add"%kind)(location=loc,rotation=rot,**kw)
    o=bpy.context.object;o.name=name;o.scale=scale;o.data.materials.append(mat_)
    bpy.ops.object.shade_smooth();return o
def sphere(n,loc,r,m,scale=(1,1,1)):return prim("uv_sphere",n,loc,m,scale,segments=20,ring_count=12,radius=r)
def cyl(n,loc,r,h,m,rot=(0,0,0)):return prim("cylinder",n,loc,m,rot=rot,vertices=20,radius=r,depth=h)
def cone(n,loc,r,h,m,rot=(0,0,0)):return prim("cone",n,loc,m,rot=rot,vertices=20,radius1=r,depth=h)
def torus(n,loc,R,r,m,rot=(0,0,0)):return prim("torus",n,loc,m,rot=rot,major_segments=28,minor_segments=10,major_radius=R,minor_radius=r)
def box(n,loc,size,m,rot=(0,0,0)):return prim("cube",n,loc,m,scale=(size[0]/2,size[1]/2,size[2]/2),rot=rot,size=2)
def join(parts,name):
    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:p.select_set(True)
    bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join()
    o=bpy.context.object;o.name=name;return o

SKIN={"light":"ffd0b0","tan":"eaa76c","medium":"c67a45","dark":"7d4a2b"}
IRIS={"light":"3b7dd8","tan":"8a5a2a","medium":"2e8b57","dark":"3a2414"}
HZ=1.5  # head centre z
def avatar(name,sex,skin,hair,haircol,outfit):
    sk=mat("skin_"+skin,hexc(SKIN[skin]));hm=mat("hair_"+haircol,hexc(haircol),.7);om=mat("outfit",hexc(outfit),.5)
    P=[]
    P.append(sphere("head",(0,0,HZ),.45,sk,(1.05,.95,1)))
    male=sex=="m"
    P.append(sphere("torso",(0,0,.72),1,om,(.36 if male else .32,.29,.38)))
    P.append(cyl("neck",(0,0,1.06),.11,.14,sk))
    ax=.40 if male else .36;tilt=.55;L=.42
    for s in(-1,1):
        P.append(cyl("arm",(s*ax,-.04,.74),.07,L,sk,rot=(0,-s*tilt,0)))              # arms out in a playful V
        P.append(sphere("hand",(s*(ax+L/2*math.sin(tilt)),-.04,.74-L/2*math.cos(tilt)),.11,sk,(1,.9,1)))
        P.append(cyl("leg",(s*.14,0,.22),.1,.34,om))
        P.append(sphere("foot",(s*.15,-.05,.06),1,mat("shoe",(.15,.13,.18),.4),(.14,.2,.1)))
        # disney-ish eyes: big whites, coloured iris, pupil, two sparkles, happy brow, blush
        P.append(sphere("eye",(s*.17,-.38,HZ+.02),.12,mat("eye_white",(1,1,1),.2),(1,.7,1.25)))
        P.append(sphere("iris",(s*.17,-.455,HZ+.01),.075,mat("iris_"+skin,hexc(IRIS[skin]),.3)))
        P.append(sphere("pupil",(s*.17,-.50,HZ+.01),.045,mat("pupil",(.05,.04,.08),.3)))
        P.append(sphere("shine",(s*.14,-.535,HZ+.05),.025,mat("eye_white",(1,1,1),.2)))
        P.append(sphere("shine2",(s*.20,-.53,HZ-.02),.012,mat("eye_white",(1,1,1),.2)))
        P.append(box("brow",(s*.17,-.42,HZ+.2),(.14,.03,.035),hm,rot=(0,0,s*.2)))
        P.append(sphere("blush",(s*.3,-.32,HZ-.1),1,mat("blush",hexc("ff8fa3"),.8),(.07,.03,.05)))
        if not male:P.append(box("lash",(s*.28,-.42,HZ+.1),(.06,.02,.02),mat("pupil",(.05,.04,.08),.3),rot=(0,0,s*.6)))
    P.append(sphere("nose",(0,-.46,HZ-.04),.035,sk))
    P.append(torus("smile",(0,-.37,HZ-.1),.15,.03,mat("mouth",(.55,.12,.2),.5),rot=(math.radians(55),0,0)))  # top half hidden in head -> smile
    if not male:P.append(cone("skirt",(0,0,.45),.36,.3,om))
    # hair styles
    if hair=="spiky":
        for i in range(6):
            a=i/6*math.tau;P.append(cone("spike",(math.cos(a)*.2,math.sin(a)*.2+.05,HZ+.4),.11,.3,hm,rot=(-math.sin(a)*.5,math.cos(a)*.5,0)))
        P.append(sphere("cap",(0,.08,HZ+.1),.51,hm,(1,.9,.75)))
    elif hair=="short":P.append(sphere("cap",(0,.1,HZ+.12),.51,hm,(1,.9,.8)))
    elif hair=="fade":P.append(sphere("cap",(0,.1,HZ+.14),.51,hm,(1,.9,.65)))
    elif hair=="curly":
        P.append(sphere("cap",(0,.08,HZ+.1),.51,hm,(1,.9,.8)))
        for i in range(9):
            a=i/9*math.tau;P.append(sphere("curl",(math.cos(a)*.34,math.sin(a)*.3+.08,HZ+.32),.15,hm))
    elif hair=="long":
        P.append(sphere("cap",(0,.08,HZ+.1),.53,hm,(1,.95,.85)))
        P.append(box("back",(0,.3,HZ-.35),(.6,.22,.9),hm))
    elif hair=="bun":
        P.append(sphere("cap",(0,.08,HZ+.1),.51,hm,(1,.9,.8)));P.append(sphere("bun",(0,.32,HZ+.45),.17,hm))
    elif hair=="ponytail":
        P.append(sphere("cap",(0,.08,HZ+.1),.51,hm,(1,.9,.8)));P.append(cone("tail",(0,.5,HZ-.25),.13,.7,hm,rot=(math.pi-.3,0,0)))
    elif hair=="bob":
        P.append(sphere("cap",(0,.06,HZ+.05),.54,hm,(1,.95,.95)))
    return join(P,name)

AV=[("avatar_m1","m","light","spiky","2b2b38","e63946"),("avatar_m2","m","tan","short","8a5a2a","2a6fdb"),
    ("avatar_m3","m","dark","curly","26222e","2ecc71"),("avatar_m4","m","medium","fade","f4d35e","8e44ad"),
    ("avatar_f1","f","light","long","8c4a2f","ff4d8d"),("avatar_f2","f","dark","bun","26222e","ffb32c"),
    ("avatar_f3","f","medium","ponytail","e0532f","1abc9c"),("avatar_f4","f","tan","bob","ffe08a","b39ddb")]
avatars=[avatar(*a) for a in AV]

dark=mat("glass_dark",(.05,.05,.08),.15);gold=mat("metal_gold",hexc("ffb32c"),.3,.8);black=mat("cap_black",(.08,.08,.1),.6)
def acc_music():
    hp=mat("headphone",hexc("ff4d8d"),.4)
    return join([torus("band",(0,0,HZ+.1),.54,.045,hp,rot=(math.pi/2,0,0)),cyl("cupL",(-.5,0,HZ),.14,.09,hp,rot=(0,math.pi/2,0)),cyl("cupR",(.5,0,HZ),.14,.09,hp,rot=(0,math.pi/2,0))],"acc_music")
def acc_sense():
    return join([box("lensL",(-.15,-.44,HZ+.05),(.17,.05,.11),dark),box("lensR",(.15,-.44,HZ+.05),(.17,.05,.11),dark),box("bridge",(0,-.44,HZ+.06),(.1,.03,.03),dark)],"acc_sense")
def acc_smart():
    return join([torus("rimL",(-.15,-.44,HZ+.05),.1,.015,black,rot=(math.pi/2,0,0)),torus("rimR",(.15,-.44,HZ+.05),.1,.015,black,rot=(math.pi/2,0,0)),box("bridge",(0,-.44,HZ+.06),(.1,.02,.02),black)],"acc_smart")
def acc_knowledge():
    return join([cyl("base",(0,0,HZ+.46),.3,.16,black),box("board",(0,0,HZ+.56),(.62,.62,.03),black,rot=(0,0,math.pi/4)),cyl("tassel",(.3,.0,HZ+.46),.012,.28,gold),sphere("tip",(.3,0,HZ+.32),.03,gold)],"acc_knowledge")
def acc_crazy():
    hm=mat("horn",hexc("8b1a4a"),.5)
    return join([cone("hornL",(-.3,0,HZ+.46),.1,.32,hm,rot=(0,-.45,0)),cone("hornR",(.3,0,HZ+.46),.1,.32,hm,rot=(0,.45,0))],"acc_crazy")
def acc_leader():
    P=[cyl("ring",(0,0,HZ+.48),.3,.16,gold)]
    for i in range(5):
        a=i/5*math.tau;P.append(cone("pt",(math.cos(a)*.28,math.sin(a)*.28,HZ+.62),.07,.16,gold))
    return join(P,"acc_leader")
def acc_chill():
    nm=mat("nightcap",hexc("2a2b6b"),.7)
    return join([cone("cap",(.1,.05,HZ+.64),.4,.6,nm,rot=(0,.35,0)),sphere("pom",(.32,.05,HZ+.98),.1,mat("pom",(1,1,1),.8))],"acc_chill")
def acc_dress():
    return join([box("cape",(0,.32,.72),(.62,.06,.78),mat("cape",hexc("38e8ff"),.5)),torus("collar",(0,0,1.08),.2,.04,mat("cape",hexc("38e8ff"),.5))],"acc_dress")
accs=[acc_music(),acc_sense(),acc_smart(),acc_knowledge(),acc_crazy(),acc_leader(),acc_chill(),acc_dress()]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,"avatars.glb"),export_format="GLB",use_selection=True,export_apply=True,export_yup=True)

# preview: line them up, each wearing one attribute
for i,(a,c) in enumerate(zip(avatars,accs)):
    x=(i-3.5)*1.6;a.location.x=x;c.location.x=x
bpy.ops.object.camera_add(location=(0,-14,2.2),rotation=(math.radians(84),0,0));S.camera=bpy.context.object
bpy.context.object.data.lens=38
bpy.ops.object.light_add(type="SUN",location=(4,-6,10),rotation=(math.radians(50),math.radians(20),0));bpy.context.object.data.energy=3
S.render.engine="BLENDER_WORKBENCH";S.display.shading.light="STUDIO";S.display.shading.color_type="MATERIAL";S.display.shading.show_shadows=True
S.render.resolution_x=1600;S.render.resolution_y=500;S.render.film_transparent=False
S.render.filepath=os.path.join(OUT,"blender","preview.png");bpy.ops.render.render(write_still=True)
print("DONE avatars=%d accs=%d"%(len(avatars),len(accs)))
