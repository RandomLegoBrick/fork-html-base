
var musicbox = new Music();

function runGame() {
	bdy.style.cursor = "auto";
	musicbox.run();
	
	ctx.fillStyle = "rgb(" + brightness + ", " + brightness + ", " + brightness + ")";
	ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);//redraw a white background for resetting the screen

	
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillText("Speed: " + speed, 20, 20);
	ctx.fillText("Sea Level: " + seaLevel, 20, 40);
	ctx.fillText("Cam X: " + cam.x, 20, 60);
	ctx.fillText("Cam Y: " + cam.y, 20, 80);
	ctx.fillText("Mode: " + player.mode, 20, 100);
	ctx.fillText("Rain Length: " + rain.length, 20, 120);
	ctx.fillText("Lamps Length: " + lamps.length, 20, 140);
	ctx.fillText("Splashes Length: " + splashes.length, 20, 160);
	ctx.fillText("Timer: " + timer.timer, 20, 180);
	ctx.fillText("Timer Length: " + timer.time, 20, 200);
	ctx.fillText("Player X: " + player.x, 20, 220);
	ctx.fillText("Win Location: " + winDist, 20, 240);
	ctx.fillText("Won: " + win, 20, 260);
 	///Debugging Text

	if(clicked) {
		//trans.start("menu");
	}
	
	switch(scene) {
		case "game":
			game();
		break;
		case "credits":
			credits();
		break;
		case "menu":
			menu();
		break;
		case "how":
			
		break;
		case "win":
			
		break;
	}
	
	//ctx.drawImage(imgs.get("blank"), 30, 30, 200, 200);
	trans.run();
	
	frameClick++;

	brightness -= 10;
	constrain(brightness, 0, 255);

	if(speed < 1) {
		speed = 1;
	}
}
/*
imgs.waitToRun().then(function(){
	console.log("images loaded successfully")
	sounds.waitToStart().then(function(){
		Howler.volume(1);
		document.getElementById("load").style.display = "none";
		inter = window.setInterval(runGame, 1000 / 60);
	});
});
*/
clickComplete.then(function(){
	document.getElementById("start").innerHTML = "Sound Authorized";
});

Promise.all([soundComplete, imageComplete, clickComplete]).then(function(){
	Howler.volume(1);
	document.getElementById("load").style.display = "none";
	inter = window.setInterval(runGame, 1000 / 60);
})