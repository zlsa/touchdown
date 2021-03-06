
var PLANETS={
    moon:{
        atmosphere:{
            density:0,
            height: 1000,
            color: [0,0,0]
        },
        gravity:2,
        color:"#aaa"
    },
    mars:{
        atmosphere:{
            density:0.2,
            height: 500,
            color: [170,136,85]
        },
        gravity:5,
        color:"#a40"
    },
    earth:{
        atmosphere:{
            density:1,
            height: 5000,
            color: [102,136,255]
        },
        gravity:9.8,
        color:"#4d4"
    },
    sun:{
        atmosphere:{
            density:3,
            height: 50000,
            color: [255,255,0]
        },
        gravity:20,
        color:"#ff8"
    },
    titan:{
        atmosphere:{
            density:0,
            height: 100,
            color: [0,0,0]
        },
        gravity:0.5,
        color:"#aaa"
    }
};

var PLANETS_LIST=["moon","mars","earth","sun","titan"];

function planet_init() {
    prop.planet={};

    prop.planet.pads=[];

    if("planet" in localStorage)
        planet_set(localStorage["planet"]);
    else
        planet_set("earth");

    loaded("planet");
}

function planet_next() {
    var i=PLANETS_LIST.indexOf(prop.planet.name)+1;
    if(i >= PLANETS_LIST.length)
        i=0;
    planet_set(PLANETS_LIST[i]);
}

function planet_set(p) {
    prop.planet.name=p;
    localStorage["planet"]=p;
    var p=PLANETS[p];
    prop.planet.atmosphere=p.atmosphere;
    prop.planet.gravity=-p.gravity;
    prop.planet.color=p.color;
    prop.planet.pads=[];
    planet_generate();
    planet_add_pad(0,10,20,true);
    planet_add_pad(200,30,50,false);
    for(var i=-200;i<200;i+=trange(0,Math.random(),1,10,20)) {
        var fuel=false;
        if(Math.random() > 0.4)
            fuel=true;
        planet_add_pad(-1000-i,Math.random()*200+50,
                       trange(0,Math.random(),1,8,25),fuel,"building");
    }
    if(prop.craft) {
        if(prop.craft.name && prop.craft.landed)
            craft_set(prop.craft.name);
    }
}

function planet_subdivide(deviation) {
    var nh=[];
    for(var i=0;i<prop.planet.heightfield.length-1;i++) {
        var h=prop.planet.heightfield[i];
        var hn=prop.planet.heightfield[i+1];
        nh.push(h);
//        var height=
        var height=(h[1]-(Math.random()*deviation)+hn[1]+(Math.random()*deviation))/2;
        nh.push([
            (h[0]+hn[0])/2,
            height,
        ]);
    }
    prop.planet.heightfield=nh;
    prop.planet.resolution/=2;
}

function planet_pass(deviation,times) {
    for(var i=0;i<times;i++) {
        planet_subdivide(deviation);
        deviation/=2;
    }
}

function planet_add_pad(x,a,w,fuel,type) {
    prop.planet.pads.push([x,planet_height(x)+a,w,fuel,type]);
}

function planet_is_pad(x) {
    for(var i=0;i<prop.planet.pads.length;i++) {
        var p=prop.planet.pads[i];
        if(within(x,p[0],p[2]/2))
            return(i);
    }
    return(-1);
}

function planet_pad_height(x) {
    var pad=planet_is_pad(x);
    if(pad == -1)
        return(-1000000);
    return(prop.planet.pads[pad][1]);
}

function planet_height(x) {
    var l=Math.floor(x/prop.planet.resolution);
    var h=l+1;
    l*=prop.planet.resolution;
    h*=prop.planet.resolution;
    var ground_height=trange(l,x,h,prop.planet.cache[l],prop.planet.cache[h]);
    var pad_height=planet_pad_height(x);
    if(pad_height > ground_height)
        return(pad_height);
    // if(ground_height < 100)
    //     return(100);
    return(ground_height);
}

function planet_heightfield_cache() {
    prop.planet.cache={};
    for(var i=0;i<prop.planet.heightfield.length;i++) {
        var h=prop.planet.heightfield[i];
        prop.planet.cache[h[0]]=h[1];
    }
}

function planet_generate() {
    prop.planet.heightfield=[];
    for(var i=-50;i<50;i++) {
        if(i <= 2 && i >= -2) {
            prop.planet.heightfield.push([i*300,0]);
            continue;
        }
        prop.planet.heightfield.push([i*300,Math.random()*300]);
    }
    prop.planet.resolution=300;
    planet_pass(200,7);
    planet_heightfield_cache();
}
