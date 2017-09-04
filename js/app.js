window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(a) {
		window.setTimeout(a, 1000 / 30)
	};


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// var _canvasBuffer.setAttribute('height', canvas.height);
// var _canvasBufferContext = _canvasBuffer.getContext('2d');

/*
beginPath()
新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
closePath()
闭合路径之后图形绘制命令又重新指向到上下文中。
stroke()
通过线条来绘制图形轮廓。
fill()
通过填充路径的内容区域生成实心的图形。

fillRect(x, y, width, height)
绘制一个填充的矩形
strokeRect(x, y, width, height)
绘制一个矩形的边框
clearRect(x, y, width, height)
清除指定矩形区域，让清除部分完全透明。

*/

var x = 325;
var y = 525;
var w = 50;
var h = 50;
var step = 30;
var steps = 15;
var bullets = [];
var plane
	//var bullet = new Bullet();
var clearShoot;
var interval = 100;
ctx.fillStyle = "rgb(200,0,0)";

ctx.beginPath();
ctx.fillRect(x, y, w, h);
ctx.lineWidth = 2;

function Bullet() {
	this.x = x;
	this.y = y;
	this.size = 10;
}

Bullet.prototype.fly = function() {
	this.x += 0;
	this.y -= 10;
	return this;
}

Bullet.prototype.draw = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = '#fff';
	ctx.moveTo(this.x + w / 2, this.y);
	ctx.lineTo(this.x + w / 2, this.y - this.size);
	ctx.stroke();
	return this;
}

function Plane() {
	this.x = x;
	this.y = y;
}

Plane.prototype.fly() {

}
Plane.prototype.draw() {

}

keyBoard.prototype = {
	pressedLeft: false,
	pressedRight: false,
	pressedUp: false,
	pressedSpace: false,
	keydown: function() {

	}
}

function keyBoard(e) {



	if (e.keyCode == 37) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		x -= steps;
		ctx.fillRect(x, y, w, h);
	}
	if (e.keyCode == 38) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		y -= steps;
		ctx.fillRect(x, y, w, h);
	}
	if (e.keyCode == 39) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		x += steps;
		ctx.fillRect(x, y, w, h);
	}
	if (e.keyCode == 40) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		y += steps;
		ctx.fillRect(x, y, w, h);
	}
	if (e.keyCode == 32) {
		var bullet = new Bullet();
		//console.log(bullet)
		bullets.push(bullet);
		console.log(bullets);
	}
}

function update() {
	var len = bullets.length;
	while (len--) {
		var b = bullets[len];
		b.fly();
		if (b.y <= 0) bullets.splice(len, 1);
		b.draw();
	}
	requestAnimFrame(function() {
		update()
	})
}
update();
window.onkeydown = keyBoard