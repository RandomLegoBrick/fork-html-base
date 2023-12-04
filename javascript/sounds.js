var soundLoad = false;

function buildSound(source, loop, vol, onload) {
	return new Howl({
		src: [source],
		loop: (typeof loop === "boolean") ? loop : false,
		volume: (typeof vol === "undefined") ? 1 : vol,
	})
}

function musicbox(type, tracksG, tracksM, curTrack = tracksM[0]) {
	curTrack.on("end", function(){
		var newTrack = tracksG[0];
		newTrack.play();
		curTrack = newTrack;
	});
}

function Music(type) {
	this.curType = type;
	this.gameTracks = [
		sounds.get("GameAmbience1"),
		sounds.get("GameAmbience2"),
		sounds.get("GameAmbience3"),
	];
	this.otherTracks = [
		sounds.get("MenuAmbience1"),
		sounds.get("MenuAmbience2"),
	];
	this.numGameTracks = this.gameTracks.length;
	this.curTrack = this.otherTracks[0];
	this.config();
}
Music.prototype.config = function() {
	this.curTrack.play();
	this.curTrack.fade(0, 1, 1000);
};
Music.prototype.run = function() {
	var mainObject = this;
	
	//console.log(typeof this.gameTracks)
	
	this.curTrack.once("end", function(){
		mainObject.curTrack.stop();
		//mainObject.seek(0)
		if(scene === "game" || scene === "win") {
			var newTrack = mainObject.gameTracks[randomInt(0, 2)];
		} else {
			var newTrack = mainObject.otherTracks[randomInt(0, 1)];
		}
		
		newTrack.play();
		mainObject.curTrack = newTrack;
		
	});
}

function SoundCollection(list) {
	this.list = list;
	this.total = 0;
	this.sounds = {};
	this.config(list);
}
SoundCollection.prototype.config = function(list){
	Howler.volume(0);
	var total = this.total
	for(var i = 0; i < list.length; i++) {
		var sound = buildSound(list[i].src, list[i].loop, list[i].vol);
		this.sounds[list[i].name] = sound;
		//sound.play();
		sound.once("load", function(){
			total++;
			sound.stop();
			if(total === list.length){
				soundLoad = true;
				window.dispatchEvent(soundLoaded);
			}
		})
	};//
}
SoundCollection.prototype.get = function(name){
	return this.sounds[name];
}
SoundCollection.prototype.waitToStart = function() {
	return new Promise(function(resolve, reject){
		window.addEventListener("soundLoad", function(){
			resolve();
		});
		if(soundLoad) {
			resolve();
		}
	})
}

var sounds = new SoundCollection([
	{
		name: "rain",
		src: "audio/sound effects/Rain Ambience.wav", 
		loop: true, 
		vol: 0.14
	},
	{
		name: "Click1",
		src: "audio/sound effects/Click1.wav",
		loop: false,
		vol: 0.3
	},
    {
        name: "Click2",
        src: "audio/sound effects/Click2.wav",
        loop: false,
        vol: 0.3
    },
    {
        name: "Click3",
        src: "audio/sound effects/Click3.wav",
        loop: false,
        vol: 0.3
    },
    {
        name: "Click4",
        src: "audio/sound effects/Click4.wav",
        loop: false,
        vol: 0.3
    },
    {
        name: "Click5",
        src: "audio/sound effects/Click5.wav",
        loop: false,
        vol: 0.3
    },
    {
        name: "Click6",
        src: "audio/sound effects/Click6.wav",
        loop: false,
        vol: 0.3
    },
	{
		name: "Spring",
        src: "audio/sound effects/spring.mp3",
        loop: false,
        vol: 1
	},
    {
        name: "Spring2",
        src: "audio/sound effects/spring2.mp3",
        loop: false,
        vol: 1
    },
    {
        name: "deathsound",
        src: "audio/sound effects/death sound 2.mp3",
        loop: false,
        vol: 0.3,
    },
    {
        name: "Portal",
        src: "audio/sound effects/portalEntrance.mp3",
        loop: false,
        vol: 1,
    },
    {
        name: "PortalAmbience",
        src: "audio/sound effects/portal_ambience.mp3",
        loop: false,
        vol: 1,
    },
    {
        name: "PortalAmbience2",
        src: "audio/sound effects/portal_ambience2.mp3",
        loop: false,
        vol: 1,
    },
	{
		name: "deathHit",
		src: "audio/sound effects/hitSound.mp3",
		loop: false,
		vol: 0.3,
	},
	{
		name: "GameAmbience1",
		src: "audio/music/Basic Ambience.wav",
		loop: false,
		vol: 0.7
	},
	{
		name: "MenuAmbience2",
		src: "audio/music/Basic Ambience Melody.wav",
		loop: false,
		vol: 0.7
	},
	{
		name: "MenuAmbience1",
		src: "audio/music/Menu Ambience.wav",
		loop: false,
		vol: 0.7
	},
	{
		name: "GameAmbience2",
		src: "audio/music/Ambience 3 (string).wav",
		loop: false,
		vol: 0.7
	},
	{
		name: "GameAmbience3",
		src: "audio/music/Ambience 4 (string 2).wav",
		loop: false,
		vol: 0.7
	},
]);


var lampSounds = [
	sounds.get("Click1"),
	sounds.get("Click2"),
	sounds.get("Click3"),
	sounds.get("Click4"),
	sounds.get("Click5"),
	sounds.get("Click6"),
];

var lampAmbience = buildSound("audio/sound effects/lampbuzz.mp3", true, 0);
lampAmbience.play();

var deathSound = sounds.get("deathSound");

var rainSound = buildSound("calm-rain-ambient-sound-15-min-147850.mp3", true, 0.14);


function randomSound() {
	return lampSounds[randomInt(0, 5)];
}

function lampClick() {
	randomSound().play();
}

function spikeDeath() {
    sounds.get("deathsound").play();
}

function bounceSound() {
    sounds.get("Spring").play();
}

function teleportSound() {
    sounds.get("Portal").play();
}

function portalAmbience() {
    sounds.get("PortalAmbience2").play();
}

function hitWall() {
	sounds.get("deathHit").play();
}