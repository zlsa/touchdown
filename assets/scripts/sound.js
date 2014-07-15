
function sound_load_file(name,url,callback) {
    var request=new XMLHttpRequest();
    request.open("GET",url,true);
    request.responseType="arraybuffer";

    request.onload=function() {
        prop.sound.context.decodeAudioData(request.response,function(buffer) {
            prop.sound.buffers[name]=buffer;
        },function() {
            console.log("Couldn't decode audio data!");
        });
    }
    request.send();
}

function sound_init() {
    prop.sound={};
    prop.sound.context=null;

    prop.sound.crash=false;

    prop.sound.buffers={};
    prop.sound.gains={};
    prop.sound.sources=null;

    try {
        prop.sound.context=new AudioContext();
        sound_load_file("engine","assets/sounds/engine.wav");
        sound_load_file("crash","assets/sounds/crash.wav");
    }
    catch(e) {
        console.log("Web Audio API is not supported in this browser; no sound available");
    }
    loaded("sound");
}

function sound_init_sources() {
    prop.sound.sources={};
    var source=prop.sound.context.createBufferSource();
    source.buffer=prop.sound.buffers.engine;
    var gain=prop.sound.context.createGain();
    gain.gain.value=0.0;
    source.connect(gain);
    gain.connect(prop.sound.context.destination);
    source.loop=true;
    source.start(0);
    prop.sound.gains.engine=gain;
    prop.sound.sources.engine=source;
}

function sound_crashed() {
    var source=prop.sound.context.createBufferSource();
    source.buffer=prop.sound.buffers.crash;
    var gain=prop.sound.context.createGain();
    gain.gain.value=0.5;
    source.connect(gain);
    gain.connect(prop.sound.context.destination);
    source.start(0);
    prop.sound.crash=true;
    source.onended=function() {
        prop.sound.crash=false;
    };
}

function sound_real_update() {
    prop.sound.gains.engine.gain.value=crange(0,prop.craft.thrusters.up,1,0,1);
    if(prop.craft.crashed && prop.sound.crash == false) {
        sound_crashed();
    }
}


function sound_update() {
    if(("engine" in prop.sound.buffers) &&
       ("crash" in prop.sound.buffers)) {
        if(prop.sound.sources == null)
            sound_init_sources();
        sound_real_update();
    }
}