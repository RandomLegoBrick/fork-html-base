//Variables for the blocks and platformer stuff.
var player, blocks = [], lamps = [], portals = [], portalPoints = [], menuBlocks = [];

var update, updateMenu;
var randomBlock;

var levelMap;
var level = 0;

var speed = 1;//This is the scrolling speed
var sensitivity = 45;//the higher the less sensitive it is
var seaLevel = 0;
var xDist = 0;//how far along we are. 
var renderDist = 500;//How far from the player blocks will spawn
var lampClickDist = 200;//How far from the player lamps will turn on

var particles = [];
var playerParticles = [];
var rain = [];
var splashes = [];
var brightness = 0;
var nearPortal = false;

var dead = false;
var win = false;
var win2 = !false;
var winDist;

var firstTime = true;
var paused = false;
var deathPaused = false;

var levelDebug = false;
var debugSpawn = false;
var debugctx;
var takenPositions = (function(){
	var arr = [];
	for(var i = 0; i < 500; i++){
		arr.push([]);
	}
	return arr;
})(); // for debug
if(levelDebug){
	let c = document.getElementById("leveldisplay");
	c.width = 512;
	c.height = 128;
	c.style.position = "fixed";
	c.style.left = 0;
	c.style.top = 0;
	c.style.zIndex = 20;
	debugctx = c.getContext("2d");
}else{
	document.getElementById("leveldisplay").style.display = "none";
}

function configureSize() {
	renderDist = screenSize.w/3;
	lampClickDist = renderDist/3;
}
configureSize();

var cam = {
	x: 0,
	y: 0,
};//Camera stuff

function randomBlock() {
	let x = randomInt(1, 11);
	switch(x) {
		case 1:
			return "BlockTexture";
		break;
		case 2:
			return "BlockTexture2";
		break;
		case 3:
			return "BlockTexture3";
		break;
		case 4:
			return "BlockTexture4";
		break;
		case 5:
			return "BlockTexture5";
		break;
		case 6:
			return "BlockTexture6";
		break;
		case 7:
			return "BlockTexture7";
		break;
		case 8:
			return "BlockTexture8";
		break;
		case 9:
			return "BlockTexture9";
		break;
		case 10:
			return "BlockTexture10";
		break;
		case 11:
			return "BlockTexture11";
		break;
		case 12:
			return "BlockTexture12";
		break;
	}
}

function randomDirt() {
	let x = randomInt(1, 12);
	switch(x) {
		case 1:
			return "DirtTexture1";
		break;
		case 2:
			return "DirtTexture2";
		break;
		case 3:
			return "DirtTexture3";
		break;
		case 4:
			return "DirtTexture4";
		break;
		case 5:
			return "DirtTexture5";
		break;
		case 6:
			return "DirtTexture6";
		break;
		case 7:
			return "DirtTexture7";
		break;
		case 8:
			return "DirtTexture8";
		break;
		case 9:
			return "DirtTexture9";
		break;
		case 10:
			return "DirtTexture10";
		break;
		case 11:
			return "DirtTexture11";
		break;
		case 12:
			return "DirtTexture12";
		break;
	}
}

function randomWood() {
	let x = randomInt(0, 4);
	switch(x) {
		case 0:
			return "WoodTexture";
		break;
		case 1:
			return "WoodTexture2";
		break;
		case 2:
			return "WoodTexture3";
		break;
		case 3:
			return "WoodTexture4";
		break;
		case 4:
			return "WoodTexture5";
		break;
	}
}

function config() {
	update(true);
	var blockYs = [];
	for(var i in blocks) {
		
		blockYs.push(blocks[i].y);
	}

	seaLevel = player.y;

	xDist = player.x;
	
	// if(debugSpawn){
	// 	player.x = 15/2 + debugSpawn.x;
	// 	player.y = 15/2 + debugSpawn.y;
	// }
}

function configMenu() {
	updateMenu();
}

function raining() {//x, y, speed, sze, color, angle, life, height, mode, wiggle, die
	for(var i = 0; i < 2; i++) {
		rain.push(new Particle(
			player.x + random(-screenSize.w, screenSize.w + speed * 4), 
			player.y - screenSize.h/2 - 400, 
			undefined, 
			2, 
			[105, 202, 221], 
			undefined, 
			0, 
			0, 
			"fall", 
			false, 
			false
		));	
	}
	if(!ambienceRunning) {
		sounds.get("rain").play();
		ambienceRunning = true;//hehe all the shenaganszzzz
	}
	
	/*for(var i = rain.length - 1; i > 0; i--) {
		rain[i].playerDraw();//drawRain();
		rain[i].updateFall();
		if(rain[i].dead) {
			for(var j = 0; j < 3; j++) {
				splashes.push(new Particle(
					rain[i].x + random(-5, 5), 
					rain[i].y + random(-2, 2), 
					undefined, 
					2, 
					[105, 202, 221], 
					undefined, 
					20, 
					random(1, 2.5), 
					"fall", 
					false, 
					true
				));	
			}
			rain.splice(i, 1);
			continue;
		}
	}*/
	for(var i = splashes.length - 1; i > 0; i--) {
		splashes[i].playerDraw();
		splashes[i].updateFall();
		if(splashes[i].dead) {
			splashes.splice(i, 1);
			continue;
		}
	}
}

function screenFlash() {
	brightness = 255;
}

function DeathPause() {
	this.time = 100;
	this.timer = 0;
	this.running = false;
	this.done = false;
}
DeathPause.prototype.start = function() {
	this.running = true;
}
DeathPause.prototype.waiting = function() {
	if(this.running && this.timer <= this.time) {
		return true;
	} else {
		return false;
	}
}
DeathPause.prototype.reset = function() {
	this.running = false;
	this.timer = 0;
}
DeathPause.prototype.update = function() {
	if(this.running) {
		this.timer++;
	}
	if(this.timer > this.time) {
		this.done = true;
		this.running = false;
		this.timer = 0;
	}
}

//Player Object
function Player(x, y, mode) {
	this.x = x;
	this.y = y;
	this.prevX = x;
	this.prevY = y;
	this.w = 45;
	this.h = 45;
	this.angle = 0;
	this.gravity = 0;
	this.flightSensitivity = 6;
	this.fallRate = 2;
	this.canJump = false;
	this.jumping = false;
	this.mode = mode;
	this.deathSoundPlayed = false;
}
Player.prototype.draw = function() {
	if(this.mode === "ground") {
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle * Math.PI / 180);
		if(!this.jumping) {
			for(var i = 0; i <= 3; i++) {
				if(!paused) {
					playerParticles.push(new Particle(
						this.x - blockSize/2 + speed, 
						this.y + blockSize/2 - 2 + random(0, -12), 
						undefined, 
						4, 
						[255, 255, 255], 
						undefined, 
						random(10, 30), 
						random(0.5, 3.5), 
						"fall", 
						true, 
						true
					));	
				}
			}
		}
		ctx.drawImageC(imgs.get("PlayerTexture2"), 0, 0, this.w, this.h);
		ctx.restore();
	} else if("flight") {
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle * Math.PI / 180);
		for(var i = 0; i <= 3; i++) {
			if(!paused) {
				playerParticles.push(new Particle(
					this.x - blockSize/2 + speed, 
					this.y + 12, 
					random(-2, 2), 
					4, 
					[255, 255, 255], 
					random(90, 270), 
					random(10, 30), 
					random(0.5, 3.5), 
					"fly", 
					false, 
					true));	
			}
			
		}
		ctx.drawImageC(imgs.get("PlayerTextureFlight"), 0, -1, this.w + 19, this.h + 19);
		ctx.restore();
	}
	
}
Player.prototype.update = function() {
	if(levelDebug){
		if(keys[38]){
			this.y -= 20;
			this.gravity = 0;
		}else if(keys[40]){
			this.y += 20;
			this.fallRate = 0;
		}else if(keys[37]){
			this.x -= 20+speed;
		}else if(keys[39]){
			this.x += 20-speed;
		}
	}


	if(this.mode === "ground") {
		this.prevX = this.x;
	    this.prevY = this.y;
	
	    this.gravity += 0.18;
	    this.y += this.gravity;
		this.angle += 5;
	    
		for(var i = 0; i < blocks.length; i++){
			if(collide(this, blocks[i]) && (blocks[i].type === "s"|| blocks[i].type === "S")) {
				dead = true;
				if(!this.deathSoundPlayed) {
					hitWall();
					for(var i = 100; i > 0; i--) {//x, y, speed, sze, color, angle, life, height, mode, wiggle, die
						playerParticles.push(new Particle(
							this.x + random(-blockSize/2, blockSize/2), 
							this.y + random(-blockSize/2, blockSize/2), 
							undefined, 
							4, 
							[255, 255, 255], 
							undefined, 
							random(50, 200), 
							random(1, 6), 
							"fall", 
							false, 
							true
						));	
					}
				}
				this.deathSoundPlayed = true;
			}
			if(blocks[i].half && collideHalf(this, blocks[i]) && blocks[i].type !== "b"){
				if(blocks[i].type !== 't') {
					this.gravity = 0;
				} else {
					this.gravity = -10;//Tramps jumper
					bounceSound();
				}
				this.angle = close([0, 90, 180, 270, 360], this.angle);
				
				if(this.y < blocks[i].y){
					this.canJump = true;
					this.y = blocks[i].y - (this.h/2);
				} else {
					this.y = blocks[i].y + (blockSize/2) + (this.h/2);
				}
				
			} else if(collide(this, blocks[i]) && !blocks[i].half && blocks[i].type !== "b"){
				if(blocks[i].type !== 't') {
					this.gravity = 0;
				} else {
					this.gravity = -10;//Tramps
					bounceSound();
				}
				this.angle = close([0, 90, 180, 270, 360], this.angle);
				
				if(this.y < blocks[i].y){
					this.canJump = true;
					this.y = blocks[i].y - (blockSize/2) - (this.h/2);
				} else {
					this.y = blocks[i].y + (blockSize/2) + (this.h/2);
				}
				
			}
			if(collide(this, blocks[i])) {
				if(this.prevY < blocks[i].prevY) {
	            	this.canJump = true;
	        	}
			}
		}
	
		/*
		for(var i in blocks) {
	        if(collide(this, blocks[i])) {
	            if(this.prevY < blocks[i].prevY) {
	                this.canJump = true;
	            }
	            this.gravity = 0;
	            this.angle = close([0, 90, 180, 270, 360], this.angle);
	            this.y = (this.prevY < blocks[i].prevY) ? blocks[i].y - this.h : blocks[i].y + blockSize;
	        }
	    }
		*/
	    
	    this.x += speed;
	
		for(var i = 0; i < blocks.length; i++){
			if(collide(this, blocks[i]) && !blocks[i].half && blocks[i].type !== "b"){
				this.x = (this.prevX < blocks[i].prevX) ? blocks[i].x - this.w : blocks[i].x + blockSize;
				//update();

				if(!levelDebug){
					dead = true;
					if(!this.deathSoundPlayed) {
						hitWall();
						for(var i = 100; i > 0; i--) {//x, y, speed, sze, color, angle, life, height, mode, wiggle, die
							playerParticles.push(new Particle(
								this.x + random(-blockSize/2, blockSize/2), 
								this.y + random(-blockSize/2, blockSize/2), 
								undefined, 
								4, 
								[255, 255, 255], 
								undefined, 
								random(50, 200), 
								random(1, 6), 
								"fall", 
								false, 
								true
							));	
						}
					}
					this.deathSoundPlayed = true;
				}
			}
		}
		
		/*
	    for(var i in blocks) {
	        if(collide(this, blocks[i])) {
	            this.x = (this.prevX < blocks[i].prevX) ? blocks[i].x - this.w : blocks[i].x + blockSize;
	        }
	    }
		*/
	    
	    if((keys[32] || keys[38]) && this.canJump) {
	        this.gravity = -6.5;
			this.canJump = false;
	    }

		if(levelDebug && keys[16]){
			var x = Math.round(this.x/blockSize);
			var y = Math.floor(this.y/blockSize);
			if(takenPositions[y][x] == undefined){
				blocks.push(new Block((x+1) * blockSize, (y+2) * blockSize, "g", imgs.get(randomBlock())));
				console.log("block")
				takenPositions[y][x] = true;
			}
		}
		
		if(this.angle != close([0, 90, 180, 270, 360], this.angle)) {
			this.jumping = true;
		} else {
			this.jumping = false;
		}
		
		this.angle = this.angle % 360;

		if(dead === false) {
			this.deathSoundPlayed = false;
		}
	} 
	else if (this.mode === "flight") {
		this.canJump = false;
		this.prevX = this.x;
	    this.prevY = this.y;
		
	    this.y += this.fallRate;

		this.angle = 0;

		for(var i in blocks) {
			if(collide(this, blocks[i]) && (blocks[i].type === "s" || blocks[i].type === "S")) {
				dead = true;
				if(!this.deathSoundPlayed) {
					hitWall();
					for(var i = 100; i > 0; i--) {//x, y, speed, sze, color, angle, life, height, mode, wiggle, die
						playerParticles.push(new Particle(
							this.x + random(-blockSize/2, blockSize/2), 
							this.y + random(-blockSize/2, blockSize/2), 
							undefined, 
							4, 
							[255, 255, 255], 
							undefined, 
							random(50, 200), 
							random(1, 6), 
							"fall", 
							false, 
							true
						));	
					}
				}
				this.deathSoundPlayed = true;
			}
	        if(collide(this, blocks[i])) {
	            this.y = (this.prevY < blocks[i].prevY) ? blocks[i].y - this.h : blocks[i].y + blocks[i].h;
	        }
	    }

		this.x += speed;
	
		for(var i in blocks){
			if(collide(this, blocks[i])){
				this.x = (this.prevX < blocks[i].prevX) ? blocks[i].x - this.w : blocks[i].x + blocks[i].h;
				dead = true;
				if(!this.deathSoundPlayed) {
					hitWall();
					for(var i = 100; i > 0; i--) {//x, y, speed, sze, color, angle, life, height, mode, wiggle, die
						playerParticles.push(new Particle(
							this.x + random(-blockSize/2, blockSize/2), 
							this.y + random(-blockSize/2, blockSize/2), 
							undefined, 
							4, 
							[255, 255, 255], 
							undefined, 
							random(50, 200), 
							random(1, 6), 
							"fall", 
							false, 
							true
						));	
					}
				}
				this.deathSoundPlayed = true;
			}
		}

		if(keys[32] || keys[38]) {
			this.fallRate -= 0.5;
		} else {
			this.fallRate += 0.5;
		}

		this.fallRate = constrain(this.fallRate, -this.flightSensitivity, this.flightSensitivity);

		if(dead === false) {
			this.deathSoundPlayed = false;
		}
	}

	speed = ((seaLevel - this.y)/150) + 3;
};
Player.prototype.menuUpdate = function() {
	this.prevX = this.x;
	this.prevY = this.y;

	this.gravity += 0.18;
	this.y += this.gravity;
	this.angle += 5;

	for(var i = 0; i < menuBlocks.length; i++){
		if(collide(this, menuBlocks[i]) && (menuBlocks[i].type === "s"|| menuBlocks[i].type === "S")) {
			dead = true;
			if(!this.deathSoundPlayed) {
				hitWall();
				for(var i = 100; i > 0; i--) {//x, y, speed, sze, color, angle, life, height, mode, wiggle, die
					playerParticles.push(new Particle(
						this.x + random(-blockSize/2, blockSize/2), 
						this.y + random(-blockSize/2, blockSize/2), 
						undefined, 
						4, 
						[255, 255, 255], 
						undefined, 
						random(50, 200), 
						random(1, 6), 
						"fall", 
						false, 
						true
					));	
				}
			}
			this.deathSoundPlayed = true;
		}
		if(menuBlocks[i].half && collideHalf(this, menuBlocks[i]) && menuBlocks[i].type !== "b"){
			if(menuBlocks[i].type !== 't') {
				this.gravity = 0;
			} else {
				this.gravity = -10;//Tramps jumper
				bounceSound();
			}
			this.angle = close([0, 90, 180, 270, 360], this.angle);

			if(this.y < menuBlocks[i].y){
				this.canJump = true;
				this.y = menuBlocks[i].y - (this.h/2);
			} else {
				this.y = menuBlocks[i].y + (blockSize/2) + (this.h/2);
			}

		} else if(collide(this, menuBlocks[i]) && !menuBlocks[i].half && menuBlocks[i].type !== "b"){
			if(menuBlocks[i].type !== 't') {
				this.gravity = 0;
			} else {
				this.gravity = -10;//Tramps
				bounceSound();
			}
			this.angle = close([0, 90, 180, 270, 360], this.angle);

			if(this.y < menuBlocks[i].y){
				this.canJump = true;
				this.y = menuBlocks[i].y - (blockSize/2) - (this.h/2);
			} else {
				this.y = menuBlocks[i].y + (blockSize/2) + (this.h/2);
			}

		}
		if(collide(this, menuBlocks[i])) {
			if(this.prevY < menuBlocks[i].prevY) {
				this.canJump = true;
			}
		}
	}
	
	this.x += speed;

	for(var i = 0; i < menuBlocks.length; i++){
		if(collide(this, menuBlocks[i]) && !menuBlocks[i].half && menuBlocks[i].type !== "b"){
			this.x = (this.prevX < menuBlocks[i].prevX) ? menuBlocks[i].x - this.w : menuBlocks[i].x + blockSize;
			//update();
			dead = true;
			if(!this.deathSoundPlayed) {
				hitWall();
				for(var i = 100; i > 0; i--) {//x, y, speed, sze, color, angle, life, height, mode, wiggle, die
					playerParticles.push(new Particle(
						this.x + random(-blockSize/2, blockSize/2), 
						this.y + random(-blockSize/2, blockSize/2), 
						undefined, 
						4, 
						[255, 255, 255], 
						undefined, 
						random(50, 200), 
						random(1, 6), 
						"fall", 
						false, 
						true
					));	
				}
			}
			this.deathSoundPlayed = true;
		}
	}

	/*
	for(var i in blocks) {
		if(collide(this, blocks[i])) {
			this.x = (this.prevX < blocks[i].prevX) ? blocks[i].x - this.w : blocks[i].x + blockSize;
		}
	}
	*/

	if((keys[32] || keys[38]) && this.canJump) {
		this.gravity = -6.5;
		this.canJump = false;
	}

	if(this.angle != close([0, 90, 180, 270, 360], this.angle)) {
		this.jumping = true;
	} else {
		this.jumping = false;
	}

	this.angle = this.angle % 360;

	if(dead === false) {
		this.deathSoundPlayed = false;
	}
	speed = ((seaLevel - this.y)/50) + 3;
};

function Block(x, y, type, image) {
	this.x = x; 
	this.y = y;
	this.w = 0;
	this.h = 0;
	this.prevX = x;
	this.prevY = y;
	this.speed = 3;

	this.image = image;

	this.type = type;
}
Block.prototype.display = function(drawn) {
	this.drawn = drawn;
	
	this.prevX = this.x;
	this.prevY = this.y;
	
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.strokeStyle = "rgb(0, 0, 0)";
	if(this.w > 1) {
		ctx.drawImageC(this.image, this.x, this.y, this.w, this.h);
	}
	if (this.drawn) {
		void((this.fadeIn()) ? this.fadeIn:null);
	} else {
		this.fadeOut();
	}
	
}
Block.prototype.fadeIn = function() {
	this.w += this.speed;
	this.h += this.speed;

	if(this.w >= blockSize || this.h >= blockSize) {
		this.w = blockSize;
		this.h = blockSize;
		return true;
	} else {
		return false;
	}
}
Block.prototype.fadeOut = function() {
	if(this.w >= 0 || this.h >= 0){
		
		this.w -= this.speed;
		this.h -= this.speed;

		if(this.w <= 0 || this.h <= 0) {
			return false;
		} else {
			return true;
		}
		
	}
}

function PortalChange(x, y) {
	this.x = x;
	this.y = y;
	this.w = blockSize;
	this.h = blockSize;
}
PortalChange.prototype.frontDark = function() {
	ctx.drawImage(imgs.get("portalDarkFront"), this.x - 10, this.y - blockSize + 5, blockSize * 2, blockSize * 4)
}
PortalChange.prototype.backDark = function() {
	ctx.drawImage(imgs.get("portalDarkBack"), this.x - blockSize, this.y - blockSize + 5, blockSize * 2, blockSize * 4)
}
PortalChange.prototype.frontLit = function() {
	
	ctx.drawImage(imgs.get("portalLitFront"), this.x - 10, this.y - blockSize + 5, blockSize * 2, blockSize * 4);
}
PortalChange.prototype.backLit = function() {
	ctx.drawImage(imgs.get("portalLitBack"), this.x - blockSize, this.y - blockSize + 5, blockSize * 2, blockSize * 4)
}

function PortalChangeDark(x, y) {
	PortalChange.apply(this, arguments);
	this.soundPlayed = false;
}
PortalChangeDark.prototype.all = function() {
	if(collide(this, player)) {
		player.mode = "flight";
		if(!this.soundPlayed) {
			teleportSound();
		}
		this.soundPlayed = true;
	}
}

function Lamp() {
	Block.apply(this, arguments);
	this.upperLit = false;
	this.clickedOn = false;
	this.clickedOff = false;
}
Lamp.prototype = Object.create(Block.prototype);
Lamp.prototype.display = function(drawn, lit) {
	this.prevX = this.x;
	this.prevY = this.y;
	
	if(this.w > 1) {
		switch(this.type) {
			case "1":
				ctx.drawImageC(imgs.get("LampBase"), this.x, this.y, this.w, this.h);
			break;
			case "2":
				if(lit){
					ctx.drawImageC(imgs.get("LampMiddleLit"), this.x, this.y, this.w, this.h);
				} else {
					ctx.drawImageC(imgs.get("LampMiddleDark"), this.x, this.y, this.w, this.h);
				}
			break;
			case "3":
				if(lit){
					ctx.drawImageC(imgs.get("LampTopLit"), this.x, this.y, this.w, this.h);
					ctx.drawImageC(imgs.get("fadeLeft"), this.x - blockSize - (blockSize / 2) - 2, this.y + 11, this.w * 2.5, this.h * 2.5);
					ctx.drawImageC(imgs.get("fadeRight"), this.x + blockSize + (blockSize / 2) + 2, this.y + 14.5, this.w * 2.5, this.h * 2.5);
					this.upperLit = true;
				} else {
					ctx.drawImageC(imgs.get("LampTopDark"), this.x, this.y, this.w, this.h);
					this.upperLit = false;
				}
				
			break;
		}

	}
	if (drawn) {
		void((this.fadeIn()) ? this.fadeIn:null);
	} else {
		this.fadeOut();
	}

	if(this.upperLit && !this.clickedOn) {
		lampClick();
		this.clickedOn = true;
		this.clickedOff = false;
	}
	if(!this.upperLit && this.clickedOn && !this.clickedOff) {
		lampClick();
		this.clickedOn = false;
		this.clickedOff = true;
	}

	lampAmbience.volume = normalize(lampClickDist, 0, 1);
	
}

function RainParticle(x, y, fall, sze, color) {
	this.x = x;
	this.y = y;
	this.prevX = x;
	this.prevY = y;
	this.w = sze;
	this.h = sze;
	this.col = color;
	this.size = sze;
	this.dead = false;
}
RainParticle.prototype.drawRain = function(){
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.fillStyle = "rgb(" + this.col.r + "," + this.col.g + "," + this.col.b + "," + ")";
	ctx.fill();
	ctx.rect(0, 0, this.sze, this.sze * 2);
	ctx.restore();
};
RainParticle.prototype.updateFall = function() {
	this.prevX = this.x;
	this.prevY = this.y;

	this.y += this.fall;

	for(var i in blocks) {
		if(collideHalf(this, blocks[i])) {
			this.dead = true;
			/*this.gravity = this.originalGrav / 2;
			this.y = (this.prevY < blocks[i].prevY) ? blocks[i].y - this.h/2 - blockSize/2: blocks[i].y + blockSize/2 + this.h/2;
			this.originalGrav /= 2;*/
		}
	}
};

var pauseButton = new Button(null, imgs.get("pause2"), imgs.get("pause2"), screenSize.w - 100, 100, blockSize, blockSize, function(){
	paused = true;
});
var playButton = new Button(null, imgs.get("play2"), imgs.get("play2"), screenSize.w - 100, 100, blockSize, blockSize, function(){
	paused = false;
});

var player = new Player(undefined, undefined, "ground");
var menuPlayer = new Player(undefined, undefined, "ground");

var timer = new DeathPause();

const grd = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
grd.addColorStop(0.9, "rgb(20, 25, 30)");
grd.addColorStop(1, "rgb(255, 200, 100)");
var bgScroll = 0;

function game() {
	//Put background here.

	if(scene !== "game") {
		paused = true;
	}

	cam.x = lerp(cam.x, window.innerWidth / 2 - 20 / 2 - player.x, 0.1);
    cam.y = lerp(cam.y, window.innerHeight / 2 - 20 / 2 - player.y, 0.1);

	ctx.fillStyle = grd;
	ctx.rect(window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight)
	bgScroll ++;	
	for(var i = 0; i < 3; i++){
		ctx.drawImage(imgs.get("mountains"), i * 1280 - bgScroll, window.innerHeight-1280);
	}
	if(bgScroll >= 1280){
		bgScroll = 0;
	}

	ctx.save();
	ctx.translate(cam.x, cam.y);

	for (var i in blocks) {
		if(1 * (dist(player.x, player.y, blocks[i].x, blocks[i].y) < renderDist)) {
			blocks[i].display(true);
		} else {
			blocks[i].display(false);
		}


		if(levelDebug){
			let clr = levelMapColors[blocks[i].type];
			debugctx.fillStyle = "rgb(" + clr[0] + ", " + clr[1] + ", " + clr[2] + ")";
			debugctx.fillRect(blocks[i].x/blockSize, blocks[i].y/blockSize, 1, 1);
		}
	}
	for (var i in lamps) {
		if(1 * (dist(player.x, player.y, lamps[i].x, lamps[i].y) < renderDist)) {
			if(1 * (dist(player.x, player.y, lamps[i].x, lamps[i].y) < lampClickDist)) {
				lamps[i].display(true, true);
			} else {
				lamps[i].display(true, false);
			}	
		} else {
			lamps[i].display(false, false);
		}
	}
	for (var i in portalPoints) {
		portalPoints[i].all();
	}
	for(var i in portals) {
		if(dist(player.x, player.y, portals[i].x, portals[i].y) < renderDist) {
			portals[i].backLit();
			nearPortal = true;
		} else {
			portals[i].backDark();
			nearPortal = false;
		}
	}
	
	for(var i = playerParticles.length - 1; i > 0; i--) {
		playerParticles[i].playerDraw();
		if(playerParticles[i].mode === "fall") {
			playerParticles[i].updateFall();
		} else if (playerParticles[i].mode === "fly") {
			playerParticles[i].updateFly();
		}
		if(playerParticles[i].dead) {
			playerParticles.splice(i, 1);
			continue;
		}
	}
	
	if(!paused) {
		player.update();
	}
	if(!dead) {
		player.draw();
	}

	for(var i in portals) {
		if(dist(player.x, player.y, portals[i].x, portals[i].y) < renderDist) {
			portals[i].frontLit();
		} else {
			portals[i].frontDark();
		}
	}

	raining();
	
	ctx.restore();

	if(!paused) {
		pauseButton.all();
	} else {
		if(timer.timer === 0) {
			playButton.all();
		} else {
			pauseButton.all();
		}
	}
	//console.log(paused + " " + dead);

	if(dead) {
		paused = true;
		timer.start();
	}
	if(timer.timer === timer.time) {
		update();
		// if(debugSpawn){
		// 	player.x = 15/2 + debugSpawn.x;
		// 	player.y = 15/2 + debugSpawn.y;
		// }
		paused = false;
	}

	timer.update();
	
	if(player.x > winDist) {
		win = true;
	}
	if(player.y > 8000){
		dead = true;
	}

	xDist += speed;

	if(nearPortal === true && portalAmbience.playing === false) {
		portalAmbience.play();
	} else if (portalAmbience.playing === false){
		portalAmbience.stop();
	}

	if(win && win2) {
		trans.start("menu");
		win2 = false;
	}
}

levelMapIndex = {
	'p':'player',
	'g':'normal',
	'w':'wood',
	'd':'dirt',
	's':'spike',
	'S':'downSpike',
	'1':'lampB',
	'2':'lampM',
	'3':'lampT',
	'c':'portal',
	'C':'portalInvis',
	't':'trampoline',
	'b':'bush',
	'e':'win',
	'P':'menuPlayer',
	'@' : 'debugPlayer',
};

levelMapColors = {
	" " : [0, 0, 0], 
	"g" : [67, 101, 48], 
	"d" : [52, 35, 26], 
	"s" : [72, 70, 68], 
	"b" : [102, 139, 81], 
	"t" : [156, 133, 120], 
	"w" : [131, 91, 52], 
	"3" : [255, 255, 0], 
	"2" : [95, 95, 95], 
	"1" : [75, 75, 75], 
	"p" : [255, 255, 255]
}

var levelMapMenu = [
	'',
	'',
	'',
	'',
	'',
	'',
	'',
	'',
	'P',
	'gggggggggggggggggggggggggggggtgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
	'',
	'',
	'',
	'',
	'',
	'',
	'',
];

function update(updateblocks) {

	if(updateblocks){
		blocks = [];
		lamps = [];
	}
	levelMap = levels[level];

	for(var i = 0; i < levelMap.length; i++) {
		for(var j = 0; j < levelMap[i].length; j++) {
			if(levelMapIndex[levelMap[i][j]] === "player"){
				player.x = 15/2 + j * blockSize;
				player.y = 15/2 + i * blockSize;
			}
			if(updateblocks){
				if(levelMap[i][j] !== " "){
					takenPositions[i][j] = true;
				}
				switch(levelMapIndex[levelMap[i][j]]) {
					case "normal":
						blocks.push(new Block(j * blockSize, i * blockSize, levelMap[i][j], imgs.get(randomBlock())));
					break;
					case "wood":
						blocks.push(new Block(j * blockSize, i * blockSize, levelMap[i][j], imgs.get(randomWood())));
					break;
					case "spike":
						blocks.push(new Block(j * blockSize, i * blockSize, levelMap[i][j], imgs.get("Spike")));
					break;
					case "lampB":
						lamps.push(new Lamp(j * blockSize, i * blockSize, levelMap[i][j], null));
					break;
					case "lampM":
						lamps.push(new Lamp(j * blockSize, i * blockSize, levelMap[i][j], null));
					break;
					case "lampT":
						lamps.push(new Lamp(j * blockSize, i * blockSize, levelMap[i][j], null));
					break;
					case "portal":
						portals.push(new PortalChange(j * blockSize, i * blockSize));
					break;
					case "portalInvis":
						portalPoints.push(new PortalChangeDark(j * blockSize, i * blockSize));
					break;
					case "trampoline":
						blocks.push(new Block(j * blockSize, i * blockSize, levelMap[i][j], imgs.get("trampoline")));
					break;
					case "dirt":
						blocks.push(new Block(j * blockSize, i * blockSize, levelMap[i][j], imgs.get(randomDirt())));
					break;
					case "downSpike":
						blocks.push(new Block(j * blockSize, i * blockSize, levelMap[i][j], imgs.get("spikeDown")));
					break;
					case "bush":
						blocks.push(new Block(j * blockSize, i * blockSize, levelMap[i][j], imgs.get("bush")));
					break;
					case "win":
						winDist = j * blockSize;
					break;
					case "debugPlayer":
						// if(debugSpawn){
						// 	debugSpawn = {x: j * blockSize, y: i * blockSize};
						// }
				}
			}
		}
		if(i ===  levelMap.length + 1) {
			blocks[i].y = seaLevel;
		}
	}
	

	player.gravity = 0;
	player.angle = 180;
	if(!firstTime) {
		spikeDeath();
		screenFlash();
		//timer.start();
	}
    firstTime = false;
	dead = false;
}

function updateMenu() {
	menuBlocks = [];

	for(var i = 0; i < levelMapMenu.length; i++) {
		for(var j = 0; j < levelMapMenu[i].length; j++) {
			switch(levelMapIndex[levelMapMenu[i][j]]) {
				case "player":
					player.x = 15/2 + j * blockSize;
					player.y = 15/2 + i * blockSize;
				break;
				case "normal":
					menuBlocks.push(new Block(j * blockSize, i * blockSize, levelMapMenu[i][j], imgs.get(randomBlock())));
				break;
				case "wood":
					menuBlocks.push(new Block(j * blockSize, i * blockSize, levelMapMenu[i][j], imgs.get(randomWood())));
				break;
				case "spike":
					menuBlocks.push(new Block(j * blockSize, i * blockSize, levelMapMenu[i][j], imgs.get("Spike")));
				break;
				case "lampB":
					lamps.push(new Lamp(j * blockSize, i * blockSize, levelMapMenu[i][j], null));
				break;
				case "lampM":
					lamps.push(new Lamp(j * blockSize, i * blockSize, levelMapMenu[i][j], null));
				break;
				case "lampT":
					lamps.push(new Lamp(j * blockSize, i * blockSize, levelMapMenu[i][j], null));
				break;
				case "portal":
					portals.push(new PortalChange(j * blockSize, i * blockSize));
				break;
				case "portalInvis":
					portalPoints.push(new PortalChangeDark(j * blockSize, i * blockSize));
				break;
				case "trampoline":
					menuBlocks.push(new Block(j * blockSize, i * blockSize, levelMapMenu[i][j], imgs.get("trampoline")));
				break;
				case "dirt":
					menuBlocks.push(new Block(j * blockSize, i * blockSize, levelMapMenu[i][j], imgs.get(randomDirt())));
				break;
				case "downSpike":
					menuBlocks.push(new Block(j * blockSize, i * blockSize, levelMapMenu[i][j], imgs.get("spikeDown")));
				break;
				case "bush":
					menuBlocks.push(new Block(j * blockSize, i * blockSize, levelMapMenu[i][j], imgs.get("bush")));
				break;
				case "win":
					winDist = j * blockSize;
				break;
				case "menuPlayer":
					menuPlayer.x = 15/2 + j * blockSize;
					menuPlayer.y = 15/2 + i * blockSize;
					playerReset = 15/2 + i * blockSize;
				break;
			}
		}
		if(i ===  levelMapMenu.length + 1) {
			menuBlocks[i].y = seaLevel;
		}
	}

	menuPlayer.gravity = 0;
	menuPlayer.angle = 0;

	console.log(menuBlocks.length);
}

config(true);
configMenu();