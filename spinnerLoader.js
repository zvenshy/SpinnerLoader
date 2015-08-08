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
			num = isIntersect(),
			x0, y0, sumSquaresSqrt,
			p1 = {}, p2 = {}, p3 = {}, p4 = {}, p5 = {},
			alpha, beta, gama,
			x = box.x + (box.radius - fixedCircle.radius) * Math.sin(angle),
			y = box.y + (box.radius - fixedCircle.radius) * ( 1 - Math.cos(angle) );

		context.clearRect(moveCircle.beforeX - 2 * r, moveCircle.beforeY - 2 * r, r * 4, r * 4);
		initFixed(box, fixedCircle.radius);
		if ( num ) {
			realRaduis = R + (1 - distance / (R + r));
			x0 = fixedCircle.x[num];
			y0 = fixedCircle.y[num];
			sumSquaresSqrt = (Math.sqrt( (x0 - x) ^ 2 + (y0 -y) ^ 2 ));
			p5.x = (x0 + x)/2;
			p5.y = (y0 + y)/2;
			alpha = Math.atan( (x0 - x) / (y0 - y) );
			beta = Math.acos( (R - r) / sumSquaresSqrt ) - alpha;
			gama = Math.asin( (R - r) / sumSquaresSqrt );
			p1 = {
				x: x - r * Math.sin(beta),
				y: y + r * Math.cos(beta)
			};
			p2 = {
				x: x0 - R * Math.cos(beta),
				y: y0 + R * Math.sin(beta)
			};
			p3 = {
				x: x + r * Math.sin(gama - alpha),
				y: y + r * Math.cos(gama - alpha)
			};
			p4 = {
				x: x0 + R * Math.sin(alpha - gama),
				y: y0 + R * Math.cos(alpha - gama)
			};

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
		return i !== len ? i : false;
	}
})();