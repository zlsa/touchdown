
var CRAFTS={
    dragon:{
        name:"SpaceX Dragon",
        fuel:{
            amount:200, // units
            density:10, // kg per unit
            energy:5
        },
        mass:50000,
        energy:100000,
        size:{
            shape:"dragon",
            radius:3.0
        }
    },
    lander:{
        fuel:{
            amount:200, // units
            density:10, // kg per unit
            energy:7
        },
        mass:7000,
        energy:10000,
        size:{
            shape:"lander",
            radius:2.0
        }
    }
};

var CRAFTS_LIST=["dragon","lander"];

var REENTRY=[0,0];

function craft_init() {
    prop.craft={};

    prop.craft.autopilot=false;
    
    prop.craft.parachute=false;
    prop.craft.crashed=false;
    prop.craft.landed=true;
    prop.craft.loc=[0,planet_height(0)+0]; // 1km up
    prop.craft.speed=[0,0];
    prop.craft.rot=0;
    prop.craft.rot_delta=0;

    prop.craft.thrusters={
        up:0,
        down:0,
        left:0,
        right:0
    };

    if("craft" in localStorage)
        craft_set(localStorage["craft"]);
    else
        craft_set("dragon");

    loaded("craft");
}

function craft_next() {
    var i=CRAFTS_LIST.indexOf(prop.craft.name)+1;
    if(i >= CRAFTS_LIST.length)
        i=0;
    craft_set(CRAFTS_LIST[i]);
}

function craft_start() {
    prop.craft.loc=[-3,planet_height(00)+prop.craft.size.radius*1.1];
    prop.craft.speed=[0.3,0.01];
    prop.craft.rot=radians(crange(0,Math.random(),1,-3,3));
    prop.craft.parachute=false;
    prop.craft.crashed=false;
    prop.craft.log=[];

    prop.craft.loc=[0,planet_height(00)+prop.craft.size.radius];
    prop.craft.speed=[0.0,0.0];
    prop.craft.rot=0;
}

function craft_set(c) {
    prop.craft.name=c;
    localStorage["craft"]=c;
    c=CRAFTS[c];
    prop.craft.mass=c.mass;
    prop.craft.fuel={};
    prop.craft.fuel.energy=c.fuel.energy;
    prop.craft.fuel.amount=c.fuel.amount;
    prop.craft.fuel.density=c.fuel.density;
    prop.craft.fuel.capacity=c.fuel.amount;
    prop.craft.size=c.size;
    prop.craft.energy=c.energy;
    if(prop.craft.landed || prop.craft.crashed) {
        craft_start();
    }
    prop.craft.crashed=false;
    prop.craft.landed=false;
    craft_update_weight();
}

function craft_update_weight() {
    prop.craft.weight=prop.craft.mass;
    prop.craft.weight+=prop.craft.fuel.amount*prop.craft.fuel.density;
}

function craft_update_thrusters() {
    if(false) {
        var agl=prop.craft.loc[1]-planet_height(prop.craft.loc[0])-prop.craft.size.radius;
        if(prop.craft.speed[1] < 0) {
            prop.craft.thrusters.up*=crange(0.2,agl,20,0.8,1);
        }
        if(agl <= 0.1 && prop.craft.speed[1] < 0.1)
            prop.craft.thrusters.up=0;
    }
    prop.craft.thrusters.up=clamp(0,prop.craft.thrusters.up,1); 
    prop.craft.thrusters.down=clamp(0,prop.craft.thrusters.down,1);
    prop.craft.thrusters.left=clamp(0,prop.craft.thrusters.left,1);
    prop.craft.thrusters.right=clamp(0,prop.craft.thrusters.right,1);
    if(prop.craft.fuel.amount <= 0 || prop.craft.crashed) {
        prop.craft.thrusters.up=0;
        prop.craft.thrusters.down=0;
        prop.craft.thrusters.left=0;
        prop.craft.thrusters.right=0;
    }
    var force=[0,0];
//    force[1]+=trange(0,prop.craft.thrusters.up,1,0,(prop.craft.energy/prop.craft.weight)/100);
    force[1]+=trange(0,prop.craft.thrusters.up,1,
                     0,
                     (prop.craft.energy/prop.craft.weight))/(1/prop.time.last_frame_elapsed)/5;
    // force[0]+=trange(0,prop.craft.thrusters.left,1,0,0.01);
    // force[0]-=trange(0,prop.craft.thrusters.right,1,0,0.01);
    if(!prop.ui.mouse.start) {
        prop.craft.rot_delta+=trange(0,prop.craft.thrusters.left,1,0,0.04);
        prop.craft.rot_delta-=trange(0,prop.craft.thrusters.right,1,0,0.04);
    }
    if(prop.craft.landed)
        prop.craft.rot_delta=0;
    prop.craft.speed[0]-=Math.cos(prop.craft.rot)*force[0];
    prop.craft.speed[0]-=Math.sin(prop.craft.rot)*force[1];
    prop.craft.speed[1]+=Math.sin(prop.craft.rot)*force[0];
    prop.craft.speed[1]+=Math.cos(prop.craft.rot)*force[1];
    if(prop.craft.crashed)
        prop.craft.rot_delta=0;
}

function craft_update_fuel() {
    if(isNaN(prop.craft.fuel.amount)) {
        prop.craft.fuel.amount=prop.craft.fuel.capacity;
    }
    if(prop.craft.refuelling)
        prop.craft.fuel.amount+=prop.craft.fuel.capacity/5000/prop.time.last_frame_elapsed;
    if(prop.craft.fuel.amount < 0) {
        console.log("Out of fuel!");
        prop.craft.fuel.amount=0;
    }
    prop.craft.fuel.amount-=trange(0,prop.craft.thrusters.up/prop.craft.fuel.energy,1,0,100)/(1/prop.time.last_frame_elapsed);
    prop.craft.fuel.amount=clamp(0,prop.craft.fuel.amount,prop.craft.fuel.capacity);
}

function craft_hit() {
    if((prop.craft.loc[1]-prop.craft.size.radius < planet_height(prop.craft.loc[0])) ||
       (prop.craft.loc[1]-prop.craft.size.radius/1.5 < planet_height(prop.craft.loc[0]-prop.craft.size.radius/1.5)) ||
       (prop.craft.loc[1]+prop.craft.size.radius/1.5 < planet_height(prop.craft.loc[0]+prop.craft.size.radius/1.5)) ||
       false)
        return true;
    return false;
    if(prop.craft.loc[1] < planet_height(prop.craft.loc[0]+Math.sin(prop.craft.rot)*prop.craft.size.radius)+prop.craft.size.radius) {
        return true;
    }
    return false;
}

function craft_autoland() {
    var ang=prop.craft.rot;
    var vspeed=prop.craft.speed[1];
    var alt=planet_height(prop.craft.loc[0])+prop.craft.loc[1];
    var target_vspeed=-crange(2,alt,200,0.0,2);
    var vspeed_difference=target_vspeed-vspeed;
    console.log(vspeed_difference);
    var power=trange(-0.2,vspeed_difference,0.2,-2,2);
    prop.craft.thrusters.up=power;
    prop.craft.thrusters.left=-ang;
    prop.craft.thrusters.right=ang;
}

function craft_update() {
    if(!prop.craft.crashed && !prop.craft.landed && prop.craft.autopilot) {
        craft_autoland();
    }
    craft_update_weight();
    craft_update_thrusters();
    craft_update_fuel();
    if(prop.craft.crashed)
        return;
    prop.craft.rot_delta*=(clamp(0,trange(0,prop.planet.atmosphere.density,1,0.9,0.5),0.9))*0.1+0.9;
    if((isNaN(prop.craft.speed[0])) || (isNaN(prop.craft.speed[1]))) {
        return;
    }
    var speed=distance([0,0],[prop.craft.speed[0],prop.craft.speed[1]])/1/prop.time.last_frame_elapsed;
    if(prop.craft.parachute && speed > 2) {
        var drag=clamp(0,trange(0,prop.planet.atmosphere.density,1,0.0,0.4),5.0);
        drag/=1/prop.time.last_frame_elapsed;
        prop.craft.speed[0]*=1-drag;
        prop.craft.speed[1]*=1-drag;
        var angle=Math.atan2(-prop.craft.speed[0],prop.craft.speed[1]);
        prop.craft.rot=angle+Math.PI;
    }
    if(prop.craft.rot > Math.PI)
        prop.craft.rot-=Math.PI*2;
    if(prop.craft.rot < -Math.PI)
        prop.craft.rot+=Math.PI*2;
    if(!prop.craft.landed) {
        prop.craft.rot+=prop.craft.rot_delta*prop.craft.thrusters.up*0.2;
    }
    if(prop.craft.rot_delta > Math.PI)
        prop.craft.rot_delta-=Math.PI*2;
    if(prop.craft.rot_delta < -Math.PI)
        prop.craft.rot_delta+=Math.PI*2;
    prop.craft.speed[1]+=prop.planet.gravity/(1/prop.time.last_frame_elapsed)/60;
    prop.craft.speed[0]*=trange(0,prop.planet.atmosphere.density,1,1,0.999);
    prop.craft.speed[1]*=trange(0,prop.planet.atmosphere.density,1,1,0.999);
    prop.craft.loc[0]+=prop.craft.speed[0];
    prop.craft.loc[1]+=prop.craft.speed[1];
    prop.craft.landed=false;
    var s=1;
    var angle=Math.atan2(s*2,planet_height(prop.craft.loc[0]-s)-planet_height(prop.craft.loc[0]+s))-Math.PI/2; //ground angle
    if(angle > Math.PI)
        angle-=Math.PI;
    if(angle < -Math.PI)
        angle+=Math.PI;
    if(craft_hit()) {
        if(within(prop.craft.speed[0],0,0.1) && within(prop.craft.speed[1],0,0.2) &&
           within(prop.craft.rot,angle,radians(8))) {
            if(planet_is_pad(prop.craft.loc[0]) != -1 && prop.planet.pads[planet_is_pad(prop.craft.loc[0])][3]) {
                prop.craft.refuelling=true;
            }
            prop.craft.rot=angle*2;
            prop.craft.rot/=2;
            prop.craft.speed[0]/=1.5;
            prop.craft.speed[1]*=-0.3;
            prop.craft.loc[1]=planet_height(prop.craft.loc[0]+Math.sin(prop.craft.rot)*prop.craft.size.radius)+prop.craft.size.radius;
            prop.craft.landed=true;
        } else {
            console.log("Crashed!");
            setTimeout(function() {
                craft_start();
            },1500);
            prop.craft.crashed=true;
        }
    } else {
        prop.craft.refuelling=false;
    }
    if(prop.craft.fuel.amount >= prop.craft.fuel.capacity) {
        prop.craft.refuelling=false;
        prop.craft.fuel.amount=prop.craft.fuel.capacity;
    }
    prop.craft.log.push([[prop.craft.loc[0],prop.craft.loc[1]],prop.craft.rot,prop.craft.thrusters.up]);
//    if(prop.craft.log.length > 1500) {
//        prop.craft.log=prop.craft.log.split(450);
//    }
}
