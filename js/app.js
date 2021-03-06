window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(a) {
		window.setTimeout(a, 1000 / 30)
	};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.lineWidth = 2;

var x = 325;
var y = 500;
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
var bulletImg = new Image();
bulletImg.src = "./img/boom.jpg"

var scores = 0;
var level = 1;
var totalLevel = 6;
var scoreText = document.querySelector(".game-info .score");
var scoreFaild = document.querySelector(".game-info-text .score");
var levelText = document.querySelector(".game-next-level")

setStatus('start');


function end() {
	if (scores == monstersNumber * (level - 1)) {
		if (level == totalLevel) {
			setStatus("all-success");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		} else {
			setStatus("success");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

	} else if (scores < monstersNumber * (level - 1) && (monsters.length == 0 || plane.crash())) {
		console.log(scores, monstersNumber * (level - 1))
		setStatus("failed");
		monsters = [];

		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}

function renderLevel() {
	levelText.innerHTML = "下一个Level： " + ++level;
}

function renderScore() {
	scoreText.innerHTML = scores;
	scoreFaild.innerHTML = scores;
}


function setStatus(a) {
	container.setAttribute("data-status", a);

}

function bindEvents() {
	var start = document.querySelector('.js-play');
	var replay = document.querySelector('.js-replay');
	var next = document.querySelector('.js-next');
	var replayAgain = document.querySelector('.js-replay-again');
	start.onclick = function() {
		setStatus("playing")
		init(1);
		update();

	}
	replay.onclick = function() {

		setStatus("playing")
		init(1);
	}
	next.onclick = function() {
		setStatus("playing")
		init(level);
		renderLevel();

	}
	replayAgain.onclick = function() {
		setStatus("playing")
		init(1);


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
// Monster.prototype.move = function() {}
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

function monsterInit(a, b, c, d) {
	var a = a || 30,
		b = b || 0,
		c = c || 2,
		d = d || 50;
	var len = monstersNumber;
	while (len--) {
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
			ctx.drawImage(bulletImg, m.x, m.y, m.size, m.size)
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
		if (plane.x > 30)
			plane.x -= plane.speed
	}
	if (keyboard.pressedRight) {
		if (plane.x < 580)
			plane.x += plane.speed
	}
	if (keyboard.pressedUp) {
		if (plane.y > 30)
			plane.y -= plane.speed
	}
	if (keyboard.pressedDown) {
		if (plane.y < 500)
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
	/* 功能2
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

function init(level) {
	monsters = [];
	bullets = [];
	plane = new Plane(x, y, w, h, speed);
	keyboard = new keyBoard();
	monsterDirection = 'right';
	scores = 0;
	if (level == 1) {
		level = 1;
		monsterInit();
	} else {
		while (level--) {
			monsterInit(null, (level + 1) * 60);
		}
	}



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
renderLevel();