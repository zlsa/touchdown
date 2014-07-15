
function canvas_init() {
    prop.canvas={};

    prop.canvas.context=$("#canvas").get(0).getContext("2d");

    prop.canvas.size={
	height:0,
	width:0
    };

    loaded("canvas");
}

function r(x) {
    var n=Math.round(x*10);
    n/=10;
    if(parseInt(n) == n) {
        n=n+".0";
    }
    return n
}

function canvas_resize() {
    prop.canvas.size.height=$(window).height();
    prop.canvas.size.width=$(window).width();
    prop.canvas.context.canvas.height=prop.canvas.size.height;
    prop.canvas.context.canvas.width=prop.canvas.size.width;
}

function canvas_clear() {
    prop.canvas.context.fillStyle="rgb("+prop.planet.atmosphere.color.join(",")+")";
    prop.canvas.context.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
    return;
//    prop.canvas.context.fillStyle=prop.canvas.context.createLinearGradient(0,0,0,prop.canvas.size.height)
    var ac=prop.planet.atmosphere.color;
    var height_of_top=prop.craft.loc[1]+(1/prop.ui.camera.scale);
    var height_of_bottom=prop.craft.loc[1]-(1/prop.ui.camera.scale);
    var top=trange(0,height_of_top,prop.planet.atmosphere.height,1,0);
    var bottom=trange(0,height_of_bottom,prop.planet.atmosphere.height,1,0);
    var top_color="rgba("+[
        crange(0,top,1,ac[0],0),
        crange(0,top,1,ac[1],0),
        crange(0,top,1,ac[2],0)].join(",")+",0)";
    var bottom_color="rgba("+[
        crange(0,bottom,1,ac[0],0),
        crange(0,bottom,1,ac[1],0),
        crange(0,bottom,1,ac[2],0)].join(",")+",0)";
//    prop.canvas.context.fillStyle.addColorStop(0.0,top_color);
//    prop.canvas.context.fillStyle.addColorStop(1.0,bottom_color);
    prop.canvas.context.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
}

function canvas_draw_pad_default(p) {
    if(p[3]) {
        prop.canvas.context.fillStyle="#777";
        prop.canvas.context.strokeStyle="#555";
        prop.canvas.context.beginPath();
        prop.canvas.context.arc(-p[2]/4,-p[2]/8,p[2]/8,0,Math.PI*2);
        prop.canvas.context.arc(p[2]/4,-p[2]/8,p[2]/8,0,Math.PI*2);
        prop.canvas.context.fill();
    }
    prop.canvas.context.fillStyle="#555";
    prop.canvas.context.strokeStyle="#555";
    prop.canvas.context.lineWidth=1/prop.ui.camera.scale*3;
    prop.canvas.context.fillRect(-p[2]/2,0,p[2],-p[2]/8);
    prop.canvas.context.beginPath();
    prop.canvas.context.moveTo(-p[2]/2,0);
    prop.canvas.context.lineTo(-p[2]/2,-1000000);
    prop.canvas.context.moveTo(p[2]/2,0);
    prop.canvas.context.lineTo(p[2]/2,-1000000);
    prop.canvas.context.moveTo(0,0);
    prop.canvas.context.lineTo(0,-1000000);
    prop.canvas.context.stroke();
}

function canvas_draw_pad_building(p) {
    prop.canvas.context.fillStyle="#555";
    prop.canvas.context.lineWidth=1/prop.ui.camera.scale*3;
    prop.canvas.context.fillRect(-p[2]/2,0,p[2],-1000000);
}

function canvas_draw_pad(p) {
    prop.canvas.context.save();
    prop.canvas.context.translate(p[0],p[1]);
    if(p[4] == "building") {
        canvas_draw_pad_building(p);
    } else {
        canvas_draw_pad_default(p);
    }
    if(p[3]) {
        prop.canvas.context.fillStyle="#fff";
        prop.canvas.context.beginPath();
        for(var i=-2;i<3;i+=2)
            prop.canvas.context.arc(i,-p[2]/15,0.5,0,Math.PI*2);
        prop.canvas.context.fill();
    }
    prop.canvas.context.restore();
}

function canvas_draw_pads() {
    for(var i=0;i<prop.planet.pads.length;i++)
        canvas_draw_pad(prop.planet.pads[i]);
}

function canvas_draw_surface() {
    // prop.canvas.context.fillStyle="#08f";
    // prop.canvas.context.fillRect(-100000,100,200000,-10000);
    canvas_draw_pads();
    prop.canvas.context.beginPath();
    prop.canvas.context.strokeStyle=prop.planet.color;
    prop.canvas.context.fillStyle=prop.planet.color;
    prop.canvas.context.lineWidth=1/prop.ui.camera.scale*1.5;
    if(prop.planet.heightfield.length <= 1)
        return;
    var h=prop.planet.heightfield[0];
    prop.canvas.context.moveTo(h[0],-10000);
    prop.canvas.context.lineTo(h[0],h[1]);
    for(var i=0;i<prop.planet.heightfield.length-1;i++) {
        var h=prop.planet.heightfield[i];
        prop.canvas.context.lineTo(h[0],h[1]);
    }
    var h=prop.planet.heightfield[prop.planet.heightfield.length-1];
    prop.canvas.context.lineTo(h[0],-10000);
    prop.canvas.context.fill();
}

function canvas_draw_craft() {
    prop.canvas.context.save();
    prop.canvas.context.translate(prop.craft.loc[0],prop.craft.loc[1]);
    prop.canvas.context.rotate(prop.craft.rot);
    prop.canvas.context.strokeStyle="#fff";
    prop.canvas.context.fillStyle="#fff";
    if(prop.craft.size.shape == "dragon") {
        prop.canvas.context.scale(1.5,1.5);
        prop.canvas.context.lineWidth*=1/1.5;
        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(-1,-1.5);
        prop.canvas.context.lineTo(-1.3,-2.0);
        prop.canvas.context.moveTo(-0.8,-2.0);
        prop.canvas.context.lineTo(-1.6,-2.0);
        prop.canvas.context.moveTo(1,-1.5);
        prop.canvas.context.lineTo(1.3,-2.0);
        prop.canvas.context.moveTo(0.8,-2.0);
        prop.canvas.context.lineTo(1.6,-2.0);
        prop.canvas.context.stroke();

        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(-0.5,1.5);
        prop.canvas.context.lineTo(0.5,1.5);
        prop.canvas.context.lineTo(2,-1.3);
        prop.canvas.context.lineTo(1,-1.5);
        prop.canvas.context.lineTo(0,-1.55);
        prop.canvas.context.lineTo(-1,-1.5);
        prop.canvas.context.lineTo(-2,-1.3);
        prop.canvas.context.lineTo(-0.5,1.5);
        prop.canvas.context.stroke();

        prop.canvas.context.strokeStyle="#f80";
        prop.canvas.context.fillStyle="#f80";

        var t=prop.craft.thrusters.up*trange(0,Math.random(),1,0.95,1.05);

        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(1.3,-1.1);
        prop.canvas.context.lineTo(trange(0,t,1,1.3,2.0),trange(0,t,1,-1.1,-5.1));
        prop.canvas.context.lineTo(0.8,-1.1);
        prop.canvas.context.moveTo(-1.3,-1.1);
        prop.canvas.context.lineTo(trange(0,t,1,-1.3,-2.0),trange(0,t,1,-1.1,-5.1));
        prop.canvas.context.lineTo(-0.8,-1.1);
        prop.canvas.context.stroke();
        prop.canvas.context.fill();

        prop.canvas.context.strokeStyle="#fff";

        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(1.1,-0.8);
        prop.canvas.context.lineTo(1.3,-1.1);
        prop.canvas.context.lineTo(0.8,-1.1);
        prop.canvas.context.stroke();

        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(-1.1,-0.8);
        prop.canvas.context.lineTo(-1.3,-1.1);
        prop.canvas.context.lineTo(-0.8,-1.1);
        prop.canvas.context.stroke();

    } else if(prop.craft.size.shape == "lander") {
        prop.canvas.context.beginPath();
        prop.canvas.context.arc(0,0.2,1.2,0,Math.PI*2);
        prop.canvas.context.stroke();

        prop.canvas.context.beginPath();
        prop.canvas.context.arc(-1.3,-0.7,0.35,0,Math.PI*2);
        prop.canvas.context.stroke();

        prop.canvas.context.beginPath();
        prop.canvas.context.arc(1.3,-0.7,0.35,0,Math.PI*2);
        prop.canvas.context.stroke();

        prop.canvas.context.strokeStyle="#f80";
        prop.canvas.context.fillStyle="#f80";

        var t=prop.craft.thrusters.up*trange(0,Math.random(),1,0.9,1.1);

        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(0.8,-1.5);
        prop.canvas.context.lineTo(0,trange(0,t,1,-1.5,-5.1));
        prop.canvas.context.lineTo(-0.8,-1.5);
        prop.canvas.context.stroke();
        prop.canvas.context.fill();

        prop.canvas.context.strokeStyle="#fff";

        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(-0.6,-0.8);
        prop.canvas.context.lineTo(-1.0,-1.5);
        prop.canvas.context.lineTo(1.0,-1.5);
        prop.canvas.context.lineTo(0.6,-0.8);
        prop.canvas.context.stroke();

        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(-0.8,-0.8);
        prop.canvas.context.lineTo(-1.5,-2.0);
        prop.canvas.context.moveTo(0.8,-0.8);
        prop.canvas.context.lineTo(1.5,-2.0);
        prop.canvas.context.stroke();

        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(-0.9,-1.3);
        prop.canvas.context.lineTo(-0.8,-1.7);
        prop.canvas.context.lineTo(0.8,-1.7);
        prop.canvas.context.lineTo(0.9,-1.3);
        prop.canvas.context.stroke();
    } else if(prop.craft.size.shape == "jetpack") {
        prop.canvas.context.beginPath();
        prop.canvas.context.arc(0,0.5,0.5,0,Math.PI*2);
        prop.canvas.context.stroke();

        prop.canvas.context.strokeStyle="#f80";
        prop.canvas.context.fillStyle="#f80";

        var t=prop.craft.thrusters.up*trange(0,Math.random(),1,0.9,1.1);

        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(0.8,-1.0);
        prop.canvas.context.lineTo(0.7,trange(0,t,1,-1.0,-5.1));
        prop.canvas.context.lineTo(0.6,-1.0);
        prop.canvas.context.moveTo(-0.8,-1.0);
        prop.canvas.context.lineTo(-0.7,trange(0,t,1,-1.0,-5.1));
        prop.canvas.context.lineTo(-0.6,-1.0);
        prop.canvas.context.stroke();
        prop.canvas.context.fill();

        prop.canvas.context.strokeStyle="#fff";
        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(-0.3,0.2);
        prop.canvas.context.lineTo(-0.8,-1.0);
        prop.canvas.context.lineTo(0.8,-1.0);
        prop.canvas.context.lineTo(0.3,0.2);
        prop.canvas.context.stroke();
    }
    if(prop.craft.parachute) {
        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(0.5,prop.craft.size.radius/1.5);
        prop.canvas.context.lineTo(10,50);
        prop.canvas.context.moveTo(-0.5,prop.craft.size.radius/1.5);
        prop.canvas.context.lineTo(-10,50);
        prop.canvas.context.stroke();
        prop.canvas.context.beginPath();
        prop.canvas.context.arc(0,50,10,0,Math.PI);
        prop.canvas.context.lineTo(10,50);
        prop.canvas.context.stroke();
    }
    prop.canvas.context.restore();
}

function canvas_draw_altimeter() {
    prop.canvas.context.save();
    prop.canvas.context.strokeStyle="#fff";
    prop.canvas.context.beginPath();
    prop.canvas.context.textAlign="left";
    prop.canvas.context.textBaseline="middle";
    prop.canvas.context.font="2px monospace";
    prop.canvas.context.arc(0,0,prop.craft.size.radius*3,radians(-80),radians(80));
    prop.canvas.context.stroke();
    prop.canvas.context.fillStyle="#fff";
    prop.canvas.context.fillText(r(prop.craft.loc[1])+" ASL",prop.craft.size.radius*3.5,1.3);
    prop.canvas.context.restore();
}

function canvas_draw_agl() {
    prop.canvas.context.save();
    prop.canvas.context.strokeStyle="#fff";
    prop.canvas.context.beginPath();
    prop.canvas.context.textAlign="left";
    prop.canvas.context.textBaseline="middle";
    prop.canvas.context.font="2px monospace";
    prop.canvas.context.fillStyle="#fff";
    var agl=prop.craft.loc[1]-planet_height(prop.craft.loc[0])-prop.craft.size.radius;
    prop.canvas.context.fillText(r(agl)+" AGL",prop.craft.size.radius*3.5,-0.8);
    prop.canvas.context.restore();
}

function canvas_draw_speed() {
    prop.canvas.context.save();
    prop.canvas.context.strokeStyle="#fff";
    prop.canvas.context.textAlign="right";
    prop.canvas.context.textBaseline="middle";
    prop.canvas.context.font="2px monospace";
    prop.canvas.context.fillStyle="#fff";
    var speed=distance(prop.craft.speed,[0,0])*10;
    prop.canvas.context.fillText(r(prop.craft.speed[0]*10)+" HORIZ",-prop.craft.size.radius*4,0.8);
    prop.canvas.context.fillText(r(prop.craft.speed[1]*10)+"  VERT",-prop.craft.size.radius*4,-1.3);
    prop.canvas.context.restore();
}

function canvas_draw_horiz() {
    prop.canvas.context.save();
    prop.canvas.context.strokeStyle="#fff";
    prop.canvas.context.textAlign="center";
    prop.canvas.context.textBaseline="bottom";
    prop.canvas.context.font="2px monospace";
    prop.canvas.context.fillStyle="#fff";
    prop.canvas.context.fillText(r(prop.craft.loc[0]),0,prop.craft.size.radius*4);
    prop.canvas.context.restore();
}

function canvas_draw_fuel() {
    prop.canvas.context.save();
    prop.canvas.context.save();
    prop.canvas.context.beginPath();
    prop.canvas.context.lineWidth*=3;
    prop.canvas.context.rotate(crange(0,prop.craft.fuel.amount,prop.craft.fuel.capacity,radians(105),radians(255)));
    prop.canvas.context.arc(0,0,prop.craft.size.radius*2.9,radians(-5),radians(5));
    prop.canvas.context.strokeStyle="#fff";
    if(prop.craft.fuel.amount < prop.craft.fuel.capacity/5)
        prop.canvas.context.strokeStyle="#f80";
    if(prop.craft.fuel.amount < prop.craft.fuel.capacity/10)
        prop.canvas.context.strokeStyle="#f00";
    prop.canvas.context.stroke();
    prop.canvas.context.restore();

    prop.canvas.context.strokeStyle="#fff";
    prop.canvas.context.beginPath();
    prop.canvas.context.arc(0,0,prop.craft.size.radius*3,radians(100),radians(260));
    prop.canvas.context.stroke();

    prop.canvas.context.restore();
}

function canvas_draw_angle() {
    prop.canvas.context.save();
    prop.canvas.context.rotate(Math.PI-prop.craft.rot);
    prop.canvas.context.strokeStyle="#fff";
    prop.canvas.context.fillStyle="#fff";
    prop.canvas.context.beginPath();
    prop.canvas.context.moveTo(0,prop.craft.size.radius*6);
    prop.canvas.context.lineTo(0,prop.craft.size.radius*8);
    prop.canvas.context.stroke();
    prop.canvas.context.beginPath();
    prop.canvas.context.arc(0,crange(0,prop.craft.thrusters.up,1,prop.craft.size.radius*6,prop.craft.size.radius*8),prop.canvas.context.lineWidth*4,0,Math.PI*2);
    prop.canvas.context.fill();
    prop.canvas.context.restore();
}

function canvas_draw_log() {
    return;
    if(prop.craft.log.length == 0)
        return;
    var samples=1000;
    prop.canvas.context.lineWidth=1/prop.ui.camera.scale*1.5;
    for(var i=clamp(0,prop.craft.log.length-samples);i<prop.craft.log.length-1;i++) {
        var p=prop.craft.log[i];
        var pl=prop.craft.log[i+1];
        var x=crange(0,p[2],1,255,0);
        var o=crange(0,prop.craft.log.length-i,samples,1,0);
        prop.canvas.context.strokeStyle="rgba(255,"+x+","+x+","+o+")";
        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(p[0][0],p[0][1]);
        prop.canvas.context.lineTo(pl[0][0],pl[0][1]);
        prop.canvas.context.stroke();
    }
}

function canvas_draw() {
    canvas_draw_surface();
    canvas_draw_craft();
    canvas_draw_log();
}

function canvas_draw_info() {
    prop.canvas.context.font="20px monospace";
    prop.canvas.context.textAlign="right";
    prop.canvas.context.fillStyle="#fff";
    prop.canvas.context.fillText("planet: "+prop.planet.name,prop.canvas.size.width-10,20);
    prop.canvas.context.fillText("craft: "+prop.craft.name,prop.canvas.size.width-10,40);
    if(prop.craft.refuelling)
        prop.canvas.context.fillText("REFUELING",prop.canvas.size.width-10,60);
    prop.canvas.context.fillStyle="#f00";
    if(prop.craft.crashed)
        prop.canvas.context.fillText("CRASHED",prop.canvas.size.width-10,60);
    if(prop.ui.mouse.start) {
        prop.canvas.context.strokeStyle="#fff";
        prop.canvas.context.lineWidth=1.5;
        prop.canvas.context.beginPath();
        prop.canvas.context.moveTo(prop.ui.mouse.start[0],prop.ui.mouse.start[1]);
        prop.canvas.context.lineTo(prop.ui.mouse.pos[0],prop.ui.mouse.pos[1]);
        prop.canvas.context.stroke();
        prop.canvas.context.strokeStyle="rgba(255,255,255,0.5)";
        prop.canvas.context.beginPath();
        prop.canvas.context.lineWidth=prop.ui.mouse.radius.outer-prop.ui.mouse.radius.inner;
        prop.canvas.context.arc(prop.ui.mouse.start[0],prop.ui.mouse.start[1],prop.ui.mouse.radius.outer-prop.canvas.context.lineWidth/2,0,Math.PI*2);
        prop.canvas.context.stroke();
    }
}

function canvas_update() {
    prop.canvas.context.lineJoin="round";
    prop.canvas.context.save();
    var dm=10;
    var agl=10000;
    for(var i=-5;i<5;i++) {
        var a=prop.craft.loc[1]-planet_height(prop.craft.loc[0]+i*dm);
        if(a < agl)
            agl=a;
    }
    var s=prop.ui.camera.scale;
//    prop.ui.camera.scale+=crange(0,agl,500,-0.2,-0.8);
    var zj=100; // zoom height
    if(agl > zj*40) {
        prop.ui.camera.scale=0.02;
    } else if(agl > zj*20) { 
        prop.ui.camera.scale=0.08;
    } else if(agl > zj) {
       prop.ui.camera.scale=0.5;
    } else if(agl > zj/5) {
        prop.ui.camera.scale=5.0;
    } else if(agl > zj/10) {
        prop.ui.camera.scale=10.0;
    } else {
        prop.ui.camera.scale=15.0;
    }
    prop.ui.camera.pan[0]=prop.craft.loc[0];
    prop.ui.camera.pan[1]=prop.craft.loc[1];
    canvas_clear();
    prop.canvas.context.translate(prop.canvas.size.width/2,prop.canvas.size.height/2);
    prop.canvas.context.scale(prop.ui.camera.scale,-prop.ui.camera.scale);
    prop.canvas.context.translate(-prop.ui.camera.pan[0],-prop.ui.camera.pan[1]);
    var shakex=trange(0,prop.craft.thrusters.up,1,0,Math.random()/5);
    var shakey=trange(0,prop.craft.thrusters.up,1,0,Math.random()/5);
    prop.canvas.context.translate(shakex,shakey);
    canvas_draw();
    prop.canvas.context.restore();
    prop.canvas.context.save();
    prop.canvas.context.translate(prop.canvas.size.width/2,prop.canvas.size.height/2);
    prop.canvas.context.scale(10,10);
    prop.canvas.context.lineWidth=2/10;
    canvas_draw_speed();
    canvas_draw_fuel();
    canvas_draw_angle();
    canvas_draw_altimeter();
    canvas_draw_agl();
    canvas_draw_horiz();
    prop.canvas.context.restore();
    prop.ui.camera.scale=s;
    canvas_draw_info();
}
