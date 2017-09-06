window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(a) {
		window.setTimeout(a, 1000 / 30)
	};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.lineWidth = 2;

var x = 325;
var y = 525;
var w = 100;
var h = 100;
var speed = 5
var bullets = [];
var monsters = [];
var monstersNumber = 7;
var monsterDirection = 'right';
var monsterDown = false;
var planeImg = new Image();
planeImg.src = "./img/plane.png";
var monsterImg = new Image();
monsterImg.src = "./img/monster.png";
var container = document.getElementById('game');
var scores = 0;
var scoreText = document.querySelector(".game-info .score");

setStatus('start');



function end() {
	if (scores == monstersNumber) {
		setStatus("success");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	} else if (scores != monstersNumber && (monsters.length == 0 || plane.crash())) {
		setStatus("failed");
		monsters = [];
		ctx.clearRect(0, 0, canvas.width, canvas.height);

	}
}

function renderLevel() {

}

function renderScore() {
	scoreText.innerHTML = scores;
}

function setStatus(a) {
	container.setAttribute("data-status", a);

}

function bindEvents() {
	var start = document.querySelector('.js-play');
	var repaly = document.querySelector('.js-replay');
	var next = document.querySelector('.js-next');
	start.onclick = function() {
		setStatus("playing")
		init();
		update();

	}
	repaly.onclick = function() {
		setStatus("playing")
		init();
	}
	next.onclick = function() {
		setStatus("playing")
		init();
	}
}

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

	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x, this.y - this.size);
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

Plane.prototype.crash = function() {
	var len = monsters.length;
	while (len--) {
		var m = monsters[len]
		var isCrashX = m.x < this.x && this.x < (m.x + m.size);
		var isCrashY = m.y < this.y && this.y < (m.y + m.size);
		if (isCrashX && isCrashY) {
			return true;
		}
	}
	return false;
}


Plane.prototype.draw = function() {
	//ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.drawImage(planeImg, this.x, this.y, this.w, this.h)
}
Plane.prototype.hit = function(m) {

	var len = bullets.length;
	while (len--) {
		var b = bullets[len];
		var isHitX = m.x < b.x && b.x < (m.x + m.size);
		var isHitY = m.y < b.y && b.y < (m.y + m.size);

		if (isHitY && isHitX) {
			//console.log(m, b);
			bullets.splice(len, 1);
			scores++;
			return true;
		}
	}
	return false;
}

function Monster(x, y, speed, size) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.size = size;
}
Monster.prototype.fly = function(len) {
	if (this.y > 500) {
		monsters = []; //删除
	}
	if (monsterDirection == 'right') {
		this.x += this.speed;
	} else if (monsterDirection == 'left') {
		this.x -= this.speed;
	}

	if (this.x > (670 - this.size)) {
		monsterDirection = 'left';
		monsterDown = true;
	} else if (this.x < 28) {
		//步数差距补充
		var l = monsters.length - 1;
		while (l--) {
			monsters[l].x -= 2 * this.speed;
		}
		monsterDirection = 'right';
		monsterDown = true;
	}

	if (monsterDown) {
		var l = monsters.length;
		while (l--) {
			monsters[l].y += 50;
		}
		monsterDown = false;
	}
}

Monster.prototype.draw = function() {

	//ctx.fillRect(this.x, this.y, this.size, this.size);
	ctx.drawImage(monsterImg, this.x, this.y, this.size, this.size)
}

Monster.prototype.boom = function() {


}

function monsterInit() {
	var len = monstersNumber;
	while (len--) {
		var a = 30,
			b = 0,
			c = 2,
			d = 50;
		var m = new Monster(a + len * 60, b, c, d);
		monsters.push(m);
	}
}


function updateMonsters() {

	var len = monsters.length;
	while (len--) {
		var m = monsters[len];
		m.fly(len);
		m.draw();
		if (plane.hit(m)) {
			monsters.splice(len, 1);
		}
	}
}

function keyBoard() {
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
		var bullet = new Bullet(plane.x + w / 2, plane.y + w / 2, 10, 10);
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
		var bullet = new Bullet(plane.x + w / 2, plane.y + w / 2, 10, 10);
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


function updateBullets() {
	var len = bullets.length;
	while (len--) {
		var b = bullets[len];
		b.fly();
		if (b.y <= 0) bullets.splice(len, 1);
		b.draw();
	}
}

function init() {
	plane = new Plane(x, y, w, h, speed);
	keyboard = new keyBoard();
	monsterDirection = 'right';
	scores = 0;
	monsterInit();

}

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateKeyBoard();
	updateMonsters();
	updateBullets();
	plane.draw();
	renderScore();
	end()
	requestAnimFrame(function() {
		update()
	})
}

bindEvents();