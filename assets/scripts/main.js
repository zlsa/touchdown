
var VERSION=[0,0,1];

var modules=[
    "prop",
    "ui",
    "planet",
    "craft",
    "canvas",
    "sound",
];
var module_number=0;
var module_start_time;

var stats=new Stats();

stats.setMode(0); // 0: fps, 1: ms
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

function loaded(module) {
    if(!(module in modules_finished))
	throw "ModuleError: nonexistent module '"+module+"'";
    if(modules_finished[module] == true)
	throw "ModuleError: module '"+module+"' was loaded multiple times";
    console.log("Loaded "+module);
    module_number+=1;
    modules_finished[module]=true;
    for(var i in modules_finished) {
	if(modules_finished[i] == false)
	    return;
    }
    done();
    document.body.appendChild( stats.domElement );
}

function init() {
    module_start_time=new Date().getTime();
    var m={};
    for(var i=0;i<modules.length;i++)
	m[modules[i]]=false;
    modules_finished=m;
}

function call_all(name) {
    for(var i=0;i<modules.length;i++) {
	if(modules[i]+"_"+name in window) {
	    window[modules[i]+"_"+name]();
	}
    };
}

function start() {
    init();
    call_all("init");
}

$(document).ready(function() {
    start();
});

function done() {
    var time=new Date().getTime()-module_start_time;
    time=(time/1000).toFixed(3);
    console.log("Loaded "+module_number+" module"+s(module_number)+" in "+time+" second"+s(time));
    resize();
    $(window).resize(resize);
    call_all("done");
    prop.time={};
    prop.time.frame_start=new Date().getTime();
    update();
}

function resize() {
    call_all("resize");
}

function update() {
    var time=new Date().getTime();
    stats.begin();
    prop.time.last_frame_elapsed=clamp(0,(time-prop.time.frame_start)/1000,0.4);
    requestAnimationFrame(update);
    call_all("update");
    stats.end();
    prop.time.frame_start=time;
}