
var Planet=function(name,parent,type,radius,mass,distance,period,orbit,angle) {
    this.name=name;
    this.type=type;
    this.parent=parent; // if null, position == [0,0]
    this.radius=radius; // in km
    this.mass=mass; // in kg
    this.distance=distance; // in km; if (parent != null) assert(distance != null)
    this.period=period; // in seconds; negative == ccw
    console.log(period);
    this.orbit=orbit; // distance along orbit in radians
    if(this.orbit == null)
        this.orbit=0;
    this.start_time=universe_time();
    this.last_time=universe_time();
    this.angle=angle; // rotation of planet
    if(this.angle == null)
        this.angle=0;

    this.loc=[0,0];

    this.update_loc=function() {
        if(this.parent == null) {
            this.loc=[0,0];
            return;
        }
        this.loc[0]=Math.sin(this.orbit)*this.distance;
        this.loc[1]=Math.cos(this.orbit)*this.distance;
        if(this.parent != null) {
            this.loc[0]+=this.parent.loc[0];
            this.loc[1]+=this.parent.loc[1];
        }
    };
    this.update_orbit=function() {
        var time=universe_time();
        var elapsed=(time-this.last_time)/1000;
        this.orbit+=elapsed/this.period;
        this.last_time=time;
    };
    this.update=function() {
        this.update_orbit();
        this.update_loc();
    };

    this.generate_cities=function() {
        this.cities=[];
        this.cities.push([0.25,10,0.2]); // rot 0.25 (on right), size 10km, height 0.2km
        for(var i=0;i<randint(50,100);i++) {
            
        }
    };

    if(this.type == "earth")
        this.generate_cities();
    this.update_loc();
};

var Thing=function(name,loc,rot,mass,radius) {
    this.name=name;
    this.loc=loc;
    this.delta=[0,0];
    this.rot=rot;
    this.delta_rot=0;
    this.mass=mass;
    this.radius=radius; // for simple collision

    this.start_time=universe_time();
    this.last_time=universe_time();

    this.update_loc=function() {
        this.loc[0]+=this.delta[0]/this.elapsed_time;
        this.loc[1]+=this.delta[1]/this.elapsed_time;
        this.rot+=this.delta_rot/this.elapsed_time;
    };
    this.update=function() {
        var time=universe_time();
        this.elapsed_time=(time-this.last_time)/1000;
        this.update_loc();
        this.last_time=time;
    };
};

function universe_time() {
    return((new Date().getTime()-100000)*1000000);
}

function universe_init() {
    prop.universe={};

    prop.universe.planets={};
    prop.universe.things={};
    var earth=new Planet(
	"Earth",
        null,
        "earth",
        6300,
        5972190000000000000000000,
        0,
        0
    );
    var sun=new Planet(
	"Sun",
        earth,
        "star",
        0,
        0,
        150000000,
        365.25*24*60*60,
        Math.PI
    );
    var moon=new Planet(
	"Moon",
        earth,
        "rocky",
        630,
        597219000000000000000,
        25000,
        28*24*60*60
    );
    var shuttle=new Thing(
	"Debug shuttle",
        [0,-6300],
        0,
        1000, // 1000 kg
        0.01 // 10 meter radius
    );
    prop.universe.planets.earth=earth;
    prop.universe.planets.moon=moon;

    prop.universe.things.shuttle=shuttle
    
    prop.universe.suns=[sun];
    
    loaded("universe");
}

function universe_update() {
    for(var i in prop.universe.planets) {
        prop.universe.planets[i].update();
    }
}