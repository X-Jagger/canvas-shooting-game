window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(a) {
		window.setTimeout(a, 1000 / 30)
	};


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var x = 325;
var y = 525;
var w = 50;
var h = 50;
var bullets = [];
var monsters = [];
var monstersNumber = 7;
var monsterDirection = 'right';
var monsterDown = false;

ctx.fillStyle = "rgb(200,0,0)";
ctx.beginPath();
ctx.fillRect(x, y, w, h);
ctx.lineWidth = 2;

function Bullet(x, y, size, speed) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.speed = speed
}

Bullet.prototype.fly = function() {
	this.x += 0;
	this.y -= this.speed;
	return this;
}

Bullet.prototype.draw = function() {

	ctx.beginPath();
	ctx.strokeStyle = '#fff';
	ctx.moveTo(this.x + w / 2, this.y);
	ctx.lineTo(this.x + w / 2, this.y - this.size);
	ctx.stroke();
	return this;
}

function Plane(x, y, w, h, speed) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.speed = speed

}

Plane.prototype.fly = function() {

}
Plane.prototype.draw = function() {
	ctx.fillRect(this.x, this.y, this.w, this.h);
}

function Monster(x, y, speed, size) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.size = size;
}
Monster.prototype.fly = function(len) {
	//为什么传入的len有6？
	//console.log(len);
	if (this.y > 500) {
		monsters = []; //删除
	}
	if (monsterDirection == 'right') {
		this.x += this.speed;
	} else if (monsterDirection == 'left') {
		this.x -= this.speed;
	}

	if (this.x > (670 - this.size - 26)) {
		//console.log(monsters[0])
		monsterDirection = 'left';
		monsterDown = true;
		//this.x += this.speed;
	} else if (this.x < 28 + this.size) {
		var l = monstersNumber - 1;
		while (l--) {
			monsters[l].x -= 2 * this.speed;
		}
		//console.log(this, len)
		//console.log(monsters)
		monsterDirection = 'right';
		monsterDown = true;
	}

	if (monsterDown) {
		var l = monstersNumber;
		while (l--) {
			monsters[l].y += 50;
		}
		monsterDown = false;
	}


}

Monster.prototype.draw = function() {
	ctx.fillRect(this.x, this.y, this.size, this.size);

}

function monsterInit() {
	var len = monstersNumber;
	while (len--) {
		var a = 76,
			b = 0,
			c = 2,
			d = 50;
		var m = new Monster(a + len * 60, b, c, d);
		monsters.push(m);
	}
}
monsterInit();

function updateMonsters() {

	var len = monsters.length;
	while (len--) {
		var m = monsters[len];
		m.fly(len);
		m.draw();
	}
}

function keyBoard() {
	//console.log(this.keydown)
	window.onkeydown = this.keydown.bind(this);
	window.onkeyup = this.keyup.bind(this);
}

keyBoard.prototype = {
	pressedLeft: false,
	pressedRight: false,
	pressedUp: false,
	pressedDown: false,
	pressedSpace: false,
	pressedSpaceHeld: false,
	pressedSpaceUp: true,
	keydown: function(e) {
		switch (e.keyCode) {
			case 37:
				this.pressedLeft = true;
				//console.log("pressedLeft")
				break;
			case 38:
				this.pressedUp = true;
				break;
			case 39:
				this.pressedRight = true;
				break;
			case 40:
				this.pressedDown = true;
				break;
			case 32:
				this.pressedSpace = true;
				this.pressedSpaceUp = false;
				break;
		}
	},
	keyup: function(e) {
		switch (e.keyCode) {
			case 37:
				this.pressedLeft = false;
				break;
			case 38:
				this.pressedUp = false;
				break;
			case 39:
				this.pressedRight = false;
				break;
			case 40:
				this.pressedDown = false;
				break;
			case 32:
				this.pressedSpace = false;
				this.pressedSpaceHeld = false;
				this.pressedSpaceUp = true;
				//console.log('up')
				break;
		}
	}
}

// 
function updateKeyBoard() {
	if (keyboard.pressedLeft) {
		plane.x -= plane.speed
	}
	if (keyboard.pressedRight) {
		plane.x += plane.speed
	}
	if (keyboard.pressedUp) {
		plane.y -= plane.speed
	}
	if (keyboard.pressedDown) {
		plane.y += plane.speed
	}
	//长按空格子弹连射
	if (keyboard.pressedSpaceHeld) {
		var bullet = new Bullet(plane.x, plane.y, 10, 10);
		bullets.push(bullet);
	}
	//单按空格子弹单射
	else if (keyboard.pressedSpace) {
		setTimeout(() => {
			if (keyboard.pressedSpace) {
				keyboard.pressedSpaceHeld = true;
			} else {
				keyboard.pressedSpaceHeld = false;
			}
		}, 1000 / 30);
		keyboard.pressedSpace = false;
		var bullet = new Bullet(plane.x, plane.y, 10, 10);
		bullets.push(bullet);

	}
	/*
	//先持续移动再发射子弹
	// else if ((keyboard.pressedLeft || keyboard.pressedRight || keyboard.pressedUp || keyboard.pressedDown) && !keyboard.pressedSpaceUp && !keyboard.pressedSpace) {
	// 	setTimeout(() => {
	// 		if (!keyboard.pressedSpaceUp) {
	// 			keyboard.pressedSpaceHeld = true;
	// 		} else {
	// 			keyboard.pressedSpaceHeld = false;
	// 		}
	// 	}, 1000 / 30);
	// }
	*/

}

var plane = new Plane(325, 525, 50, 50, 5);
var keyboard = new keyBoard();

function updateBullets() {
	var len = bullets.length;
	while (len--) {
		var b = bullets[len];
		b.fly();
		if (b.y <= 0) bullets.splice(len, 1);
		b.draw();
	}
}



function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateKeyBoard();
	updateMonsters();
	updateBullets();
	plane.draw();

	requestAnimFrame(function() {
		update()
	})
}
update();