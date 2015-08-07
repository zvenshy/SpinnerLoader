(function(){
	window.requestAnimationFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60)
			}
	})();
	var canvas = document.getElementById('loader'),
		context = canvas.getContext('2d'),
		count = 0,
		
		box = {
			x: 300,
			y: 300,
			radius: 100
		},
		fixedCircle = {
			x: [],
			y: [],
			radius: 20,
			number: 8
		},
		moveCircle = {
			x: box.x,
			y: box.y - (box.radius - fixedCircle.radius),
			beforeX: box.x,
			beforeY: box.y - (box.radius - fixedCircle.radius),
			radius: 12
		}
	initFixed(box, fixedCircle.radius);
	console.log(requestAnimationFrame)
	requestAnimationFrame(drawMoveCircle);

	function initFixed(box, r, number) {
		var n = number || 8;
		var x = 0, y = 0;
		var angle = Math.PI * 2 / n;
		var i = 0;
		context.beginPath();
		context.arc(box.x, box.y, box.radius, 0, 2*Math.PI, true);
		context.closePath();
		for (; i < n; i++) {
			x = box.x + (box.radius - r) * Math.sin(angle * i),
			y = box.y + (box.radius - r) * ( 1 - Math.cos(angle * i) );
			fixedCircle.x.push(x);
			fixedCircle.y.push(y);
			context.save();
			context.beginPath();
			context.fillStyle = '#46B9FF';
			context.arc(x, y, r, 0, 2*Math.PI, true);
			context.closePath();
			
			context.fill();
			context.restore();
		}		
	}

	function drawMoveCircle() {
		var moveAngle = 2 * Math.PI / 180,
			angle = ++ count * moveAngle,
			r = moveCircle.radius,
			R = fixedCircle.radius,
			distance = r + R,
			realRaduis = r,
			x = box.x + (box.radius - fixedCircle.radius) * Math.sin(angle),
			y = box.y + (box.radius - fixedCircle.radius) * ( 1 - Math.cos(angle) );

		context.clearRect(moveCircle.beforeX - 2 * r, moveCircle.beforeY - 2 * r, r * 4, r * 4);
		initFixed(box, fixedCircle.radius);
		if ( isIntersect() === 404 ) {
			//还未编辑....
			realRaduis = R + (1 - distance / (R + r));

		} else {
			context.beginPath();
			context.fillStyle = '#46B9FF';
			context.arc(x, y, moveCircle.radius, 0, 2 * Math.PI, true);
			context.closePath();
			context.fill();
		}
		moveCircle.beforeX = x;
		moveCircle.beforeY = y;
		requestAnimationFrame(drawMoveCircle);
	}

	function isIntersect() {
		var i = 0, len = fixedCircle.x.length;
		for (; i < len; i ++) {
			if (Math.sqrt( (moveCircle.x - fixedCircle.x[i]) ^ 2 
				+ (moveCircle.y - fixedCircle.y[i]) ^ 2) < 
				(moveCircle.radius + fixedCircle.radius) ) {
				break;
			}
		}
		return i !== len ? true : false;
	}
})();