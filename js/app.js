window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(a) {
		window.setTimeout(a, 1000 / 60)
	};


var canvas0 = document.getElementById('canvas0');
var ctx0 = canvas0.getContext('2d');
var canvas1 = document.getElementById('canvas1');
var ctx1 = canvas1.getContext('2d');
var _canvasBuffer = document.createElement('canvas');
var _canvasBuffer.setAttribute('width', canvas1.width);
// var _canvasBuffer.setAttribute('height', canvas1.height);
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
//var bullet = new Bullet();
var clearShoot;
var interval = 100;
ctx0.fillStyle = "rgb(200,0,0)";

ctx0.beginPath();
ctx0.fillRect(x, y, w, h);
ctx1.lineWidth = 5;

function Bullet() {
	this.x = x;
	this.y = y;
}

function keyBoardUp(e) {
	console.log("hello", e.keyCode);
	//37-40 左上右下
	if (e.keyCode == 37) {
		ctx0.clearRect(0, 0, canvas0.width, canvas0.height);
		ctx0.beginPath();
		x -= step;
		ctx0.fillRect(x, y, w, h);
	}
	if (e.keyCode == 38) {
		ctx0.clearRect(0, 0, canvas0.width, canvas0.height);
		ctx0.beginPath();
		y -= step;
		ctx0.fillRect(x, y, w, h);
	}
	if (e.keyCode == 39) {
		ctx0.clearRect(0, 0, canvas0.width, canvas0.height);
		ctx0.beginPath();
		x += step;
		ctx0.fillRect(x, y, w, h);
	}
	if (e.keyCode == 40) {
		ctx0.clearRect(0, 0, canvas0.width, canvas0.height);
		ctx0.beginPath();
		y += step;
		ctx0.fillRect(x, y, w, h);
	}
	if (e.keyCode == 32) {
		var bullet = new Bullet();
		bullet.clearShoot = setInterval(() => shoot(bullet), interval);
	}
}


function keyBoardDown(e) {
	if (e.keyCode == 37) {
		ctx0.clearRect(0, 0, canvas0.width, canvas0.height);
		ctx0.beginPath();
		x -= steps;
		ctx0.fillRect(x, y, w, h);
	}
	if (e.keyCode == 38) {
		ctx0.clearRect(0, 0, canvas0.width, canvas0.height);
		ctx0.beginPath();
		y -= steps;
		ctx0.fillRect(x, y, w, h);
	}
	if (e.keyCode == 39) {
		ctx0.clearRect(0, 0, canvas0.width, canvas0.height);
		ctx0.beginPath();
		x += steps;
		ctx0.fillRect(x, y, w, h);
	}
	if (e.keyCode == 40) {
		ctx0.clearRect(0, 0, canvas0.width, canvas0.height);
		ctx0.beginPath();
		y += steps;
		ctx0.fillRect(x, y, w, h);
	}
	if (e.keyCode == 32) {
		var bullet = new Bullet();
		bullet.clearShoot = setInterval(() => shoot(bullet), interval);
	}
}

function shoot(bullet) {
	return function() {

		_canvasBufferContext.clearRect(0, 0, canvas0.width, canvas0.height);
		_canvasBufferContext.beginPath();
		bullet.y -= 5;
		_canvasBufferContext.moveTo(bullet.x + w / 2, bullet.y);
		bullet.y -= 10;
		_canvasBufferContext.lineTo(bullet.x + w / 2, bullet.y);
		_canvasBufferContext.stroke();
		if (bullet.y < -10) {
			bullet.y = y;
			clearInterval(bullet.clearShoot);
		};
	}()

	//console.log(bullet.y);


}

// document.addEventListener('keyup', keyBoardUp)
// document.addEventListener('keydown', keyBoardDown)
//window.onkeyup = keyBoardUp;
window.onkeydown = keyBoardDown