
function ui_init() {
    prop.ui={};

    prop.ui.camera={};
    prop.ui.camera.pan=[0,0]; // all units in m
    prop.ui.camera.scale=10; // pixels per m

    $(window).mousewheel(function(event,d,dx,dy) {
        if(dy != 0)
            prop.ui.camera.scale+=prop.ui.camera.scale*(dy*0.2);
        prop.ui.camera.scale=clamp(50,prop.ui.camera.scale,0.05);
    });
    
    prop.ui.keys={};

    prop.ui.mouse={};
    prop.ui.mouse.radius={};
    var s=Math.min($(window).width(),$(window).height());
    prop.ui.mouse.radius.inner=s/10;
    prop.ui.mouse.radius.outer=s/4;
    prop.ui.mouse.start=null;
    prop.ui.mouse.pos=[0,0];

    $(window).bind("touchstart",function(e) {
      return;
        e.preventDefault();
        if(prop.ui.mouse.start != null) // two fingers
            return;
        prop.ui.mouse.start=[e.pageX,e.pageY];
        prop.ui.mouse.pos=[e.pageX,e.pageY];
    });

    $(window).bind("touchend",function(e) {
      return;
        e.preventDefault();
        if(prop.ui.mouse.start)
            prop.ui.mouse.start=null;
    });
    
    $(window).mousedown(function(e) {
      return;
        if(e.which == 1)
            prop.ui.mouse.start=[e.pageX,e.pageY];
        prop.ui.mouse.pos=[e.pageX,e.pageY];
    });
                        
    $(window).mouseup(function(e) {
      return;
        if(prop.ui.mouse.start != null)
            prop.ui.mouse.start=null;
    });

    $(window).bind("touchmove",function(e) {
      return;
        e.preventDefault();
        if(prop.ui.mouse.start == null)
            return;
        if(prop.craft.crashed)
            return;
        prop.ui.mouse.pos=[e.pageX,e.pageY];
        var offs=[prop.ui.mouse.start[0]-e.pageX,prop.ui.mouse.start[1]-e.pageY];
        var dist=distance(prop.ui.mouse.start,prop.ui.mouse.pos);
        prop.craft.thrusters.up=crange(prop.ui.mouse.radius.inner,dist,prop.ui.mouse.radius.outer,0,1);
        if(dist > 10 && !prop.craft.landed) {
            prop.craft.rot=Math.atan2(offs[0],offs[1]);
            prop.craft.rot_delta=0;
        }
    });
                        
    $(window).mousemove(function(e) {
      return;
        if(!prop.ui.mouse.start)
            return;
        if(prop.craft.crashed)
            return;
        prop.ui.mouse.pos=[e.pageX,e.pageY];
        var offs=[prop.ui.mouse.start[0]-e.pageX,prop.ui.mouse.start[1]-e.pageY];
        var dist=distance(prop.ui.mouse.start,prop.ui.mouse.pos);
        prop.craft.thrusters.up=crange(prop.ui.mouse.radius.inner,dist,prop.ui.mouse.radius.outer,0,1);
        if(dist > 10 && !prop.craft.landed) {
            prop.craft.rot=Math.atan2(offs[0],offs[1]);
            prop.craft.rot_delta=0;
        }
    });
    
    $(window).keydown(function(e) {
        prop.ui.keys[e.which]=true;
//        console.log(e.which);
    });
    
    $(window).keypress(function(e) {
    });
    
    $(window).keyup(function(e) {
      console.log(e.which);
        prop.ui.keys[e.which]=null;
        if(e.which == 85) {
            prop.craft.loc[0]=-1200;
            prop.craft.loc[1]=planet_height(-1200)-50;
            prop.craft.speed[0]=20;
            prop.craft.speed[1]=0.2;
            prop.craft.rot=0;
            prop.craft.rot_delta=0;
        }
        if(e.which == 82) {
            craft_set(prop.craft.name);
            craft_start();
        }
        if(e.which == 67)
            craft_next();
        if(e.which == 80)
            planet_next();
    });
    
    loaded("ui");
}

function ui_update() {
    if(prop.ui.keys["65"] == true) {
        prop.craft.autopilot=true;
    } else {
        prop.craft.autopilot=false;
    }
    if(!prop.craft.autopilot && prop.ui.mouse.start == null) {
        if(prop.ui.keys["32"] == true) {
            prop.craft.parachute=true;
        } else {
            prop.craft.parachute=false;
        }
        if(prop.ui.keys["38"] == true) {
            prop.craft.thrusters.up+=0.05;
        } else if(prop.ui.keys["40"] == true) {
            prop.craft.thrusters.up-=0.05;
        }
        if(prop.ui.keys["37"] == true) {
            prop.craft.thrusters.left+=0.1;
        } else {
            prop.craft.thrusters.left-=0.2;
        }
        if(prop.ui.keys["39"] == true) {
            prop.craft.thrusters.right+=0.1;
        } else {
            prop.craft.thrusters.right-=0.2;
        }
        if(prop.ui.keys["88"] == true) {
          prop.craft.thrusters.up=0;
        }
    }
//    prop.ui.camera.scale*=1.01;
}
