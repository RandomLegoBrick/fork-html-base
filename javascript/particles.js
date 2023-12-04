
//Particle Object
function Particle(x, y, speed, sze, color, angle, life, height, mode, wiggle, die) {
	this.x = x;
	this.y = y;
	this.prevX = x;
	this.prevY = y;
	this.gravity = -height;
	this.originalGrav = -height;
	this.w = sze;
	this.h = sze;
	this.col = color;
	this.size = sze;
	this.speed = speed;
	this.angle = angle;
	this.life = life;
	this.startLife = 0;
	this.dead = false;
	this.rot = 0;
	this.startLifeValue = this.life;
	this.mode = mode;
	this.wiggle = wiggle;
	this.die = die;
	this.config();
}
Particle.prototype.config = function() {
	if(!this.die) {
		this.life = 1;
		this.startLifeValue = 1;
	}
}
Particle.prototype.draw = function() {
	ctx.save();
	ctx.translate(this.x, this.y);
	
	ctx.fillStyle = "rgba(" + this.col[0] + "," + this.col[1] + "," + this.col[2] + "," + this.life/this.startLifeValue + ")"
	ctx.beginPath();
	ctx.ellipse(0, 0, this.size/2, this.size/2, 0, 0, Math.PI*8);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
};
Particle.prototype.playerDraw = function() {
	ctx.save();
	ctx.translate(this.x, this.y);

	ctx.fillStyle = "rgba(" + this.col[0] + "," + this.col[1] + "," + this.col[2] + "," + this.life/this.startLifeValue + ")"
	ctx.rect(0, 0, this.size, this.size, 0, 0);
	ctx.restore();
}
Particle.prototype.drawRain = function(){
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.fillStyle = "rgb(" + this.col.r + "," + this.col.g + "," + this.col.b + "," + ")";
	ctx.fill();
	ctx.rect(0, 0, this.sze, this.sze * 2);
	ctx.restore();
};
Particle.prototype.updateFly = function() {
	this.x += Math.cos(this.angle * Math.PI/180) * this.speed;
	this.y += Math.sin(this.angle * Math.PI/180) * this.speed;
	
	this.rot++;

	if(this.die) {
		this.life--;
	}
	if(this.life < 0) {
		this.dead = true;
	}
};
Particle.prototype.updateFall = function() {
	this.prevX = this.x;
    this.prevY = this.y;

    this.gravity += 0.18;
    this.y += this.gravity;
	constrain(this.gravity, -this.terminalVelocity, this.terminalVelocity);

	switch(scene) {
		case "game":
			for(var i in blocks) {
				if(collideHalf(this, blocks[i]) && blocks[i].type !== 's') {
					this.gravity = this.originalGrav / 2;
					this.y = (this.prevY < blocks[i].prevY) ? blocks[i].y - this.h/2 - blockSize/2: blocks[i].y + blockSize/2 + this.h/2;
					this.originalGrav /= 2;
					if(!this.die) {
						this.dead = true;
					}
				}
			}
		break;
		default:
			for(var i in menuBlocks) {
				if(collideHalf(this, menuBlocks[i]) && menuBlocks[i].type !== 's') {
					this.gravity = this.originalGrav / 2;
					this.y = (this.prevY < menuBlocks[i].prevY) ? menuBlocks[i].y - this.h/2 - blockSize/2: menuBlocks[i].y + blockSize/2 + this.h/2;
					this.originalGrav /= 2;
					if(!this.die) {
						this.dead = true;
					}
				}
			}
		break;
	}

	/*for(var i in blocks){
		if(collide(this, blocks[i])){
			this.x = (this.prevX < blocks[i].prevX) ? blocks[i].x - this.w : blocks[i].x + blocks[i].h;
		}
	}*/
	if(this.wiggle){
		this.x += random(-2, 1);
	}
	
	if(this.die) {
		this.life--;
	}
	if(this.life < 0) {
		this.dead = true;
	}

	if(this.y > 5000) {
		this.dead = true;
	}
};

