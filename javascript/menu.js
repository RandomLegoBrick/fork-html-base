
var creditScroll = 0;
var curScrollPos = 0;

var creditsBar = [];

var text = [
	[
		"Programming:",
		"Paul Barron",
		"Tomas Garcia"
	],
	[
		"Graphics:",
		"Eduardo Jauregui",
	],
	[
		"Music:",
		"Paul Barron",
	],
	[
		"With Help from:",
		"JP Roche",
		"Matthew Anderson",
		"Derek Leung",
	],
	[
		"Graphic Progrmas:",
		"Pixalorama",
	],
	[
		"Audio Programs:",
		"Library: Howler.js",
		"Editing: Audacity",
		"Source: Pixabay",
		"Music: Finale 27",
		"Music Performince:\nNoteperformer 4",
	],
];

var creditsButtons = [
	new Button(null, imgs.get("backOff"), imgs.get("backOn"), 300, screenSize.h - 125, blockSize*3, blockSize*2, function() {
		trans.start("menu");
	}),
	new Button(null, imgs.get("linksOff"), imgs.get("linksOn"), screenSize.w - 300, screenSize.h - 125, blockSize*3, blockSize*2, function() {
		document.getElementById("game").style.display = "none";
		document.getElementById("links").style.display = "block";
		bdy.style.overflow = "auto";
	}),
	new Button(null, imgs.get("upArrowOff"), imgs.get("upArrowOn"), center.x - 200, screenSize.h - 125, blockSize*3, blockSize*2, function() {
		creditScroll += 150;
	}),
	new Button(null, imgs.get("downArrowOff"), imgs.get("downArrowOn"), center.x + 200, screenSize.h - 125, blockSize*3, blockSize*2, function() {
		creditScroll -= 150;
	}),
];

var menuButtons = [
	new Button(null, imgs.get("mainButtonPlayOff"), imgs.get("mainPlayButtonOn"), center.x, center.y + screenSize.h/16, blockSize*4, blockSize*3, function() {
		trans.start("game");
	}),
	new Button(null, imgs.get("levelSelectOff"), imgs.get("levelSelectOn"), center.x - 300, center.y + screenSize.h/16, blockSize*3, blockSize*2, function() {
		trans.start("credits");
		creditScroll = 0;
	}),
	new Button(null, imgs.get("howOff"), imgs.get("howOn"), center.x + 300, center.y + screenSize.h/16, blockSize*3, blockSize*2, function() {
		
	}),
];

function randomRedWood() {
	let x = randomInt(0, 2);
	switch(x) {
		case 0:
			return "RedWoodTexture1";
		break;
		case 1:
			return "RedWoodTexture2";
		break;
		case 2:
			return "RedWoodTexture3";
		break;
	}
}
for(var i = 0; i < 50; i++) {
	creditsBar.push(imgs.get(randomRedWood()));
}

function creditBanners(masterLoc) {
	var x = masterLoc.x;
	var y = masterLoc.y;

	for(var i = 0, j = 0, m = 0; i < text.length; i++, j += blockSize, m++) {
		for(var k = 0, l = 0; k < text[i].length; k++, j += blockSize, m++) {
			if(k > 0) {
				ctx.drawImageC(creditsBar[m], x, y + j, blockSize, blockSize);
				m++;
				ctx.drawImageC(creditsBar[m], x + blockSize, y + j, blockSize, blockSize);
				pixelFont(text[i][k], x + 2*blockSize, y + j, 25);
			} else {
				ctx.drawImageC(creditsBar[m], x, y + j, blockSize, blockSize);
				pixelFont(text[i][k], x + blockSize, y + j, 25);
			}
			
		}
		ctx.drawImageC(imgs.get("RedWoodTexture1"), x, y + j, blockSize, blockSize);
	}
	
}

function pixelFont(txt, x, y, sze){
	txt = txt.split("\n");
	for(var i in txt){
		for(var j in txt[i]){
			ctx.save();
			ctx.translate(x + j * sze * 1.6, y + i * sze * 1.6);
			ctx.drawImageC(imgs.get(txt[i][j]), 0, 0, sze, sze);
			ctx.restore();
		}
	}
}

function titleFont(txt, x, y, sze){
	txt = txt.split("\n");
	for(var i in txt){
		for(var j in txt[i]){
			ctx.save();
			ctx.translate(x + j * sze * 1.4, y + i * sze * 1.4);
			ctx.drawImageC(imgs.get(txt[i][j] + "title"), 0, 0, sze, sze);
			ctx.restore();
		}
	}
}

function credits() {
	curScrollPos = lerp(curScrollPos, creditScroll, 0.2);
	
	ctx.save();
	ctx.translate(0, curScrollPos)
	creditBanners({x:center.x - 465, y: 250});
	ctx.restore();
	
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.strokeStyle = "rgb(255, 0, 0)";
	ctx.fillRect(0, 0, screenSize.w, 200);
	ctx.fillRect(0, screenSize.h - 200, screenSize.w, 200);

	ctx.fillRect(0, 0, 200, screenSize.h);
	ctx.fillRect(screenSize.w - 200, 0, 200, screenSize.w);
	
	pixelFont("CREDITS", center.x - (center.x * 1/3.6 - 40)/*255*/, 100, 50);

	pixelFont("Made by The Dash Devs", center.x - 355, 175, 25);

	for(var i in creditsButtons) {
		creditsButtons[i].all();
	}
}

function menu() {
	
	titleFont("HORiZON HOPPER", 140, 350, blockSize*2);

	ctx.save();
	ctx.translate (-755, -69);
	
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

	menuPlayer.draw();
	menuPlayer.menuUpdate();

	ctx.restore();

	if(menuPlayer.x > 4000) {
		menuPlayer.x = playerReset;
	}
	
    for(var i = 0; i < menuButtons.length; i++){
		menuButtons[i].all();
	}
}

