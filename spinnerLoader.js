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
		isPushArray = 0,
		
		box = {
			x: 300,
			y: 300,
			radius: 120
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
	//requestAnimationFrame(drawMoveCircle);
	drawMoveCircle()

	function initFixed(box, r, number) {
		var n = number || 8;
		var x = 0, y = 0;
		var angle = Math.PI * 2 / n;
		var i = 0;

		context.beginPath();
		context.arc(box.x, box.y, box.radius, 0, 2*Math.PI, true);
		context.closePath();
		
		for (; i < n; i++) {
			x = box.x + (box.radius - r) * Math.sin(angle * i);
			y = box.y - (box.radius - r) * Math.cos(angle * i);
			if (!isPushArray) {
				fixedCircle.x.push(x);
				fixedCircle.y.push(y);
				if(i === n - 1) {
					isPushArray = 1;
				}
			}

			context.save();
			drawCircle(x, y, r, '#46B9FF');
			context.restore();
		}
	}

	function drawCircle(x, y, r, fillcolor) {
		context.beginPath();
		context.fillStyle = fillcolor;
		context.arc(x, y, r, 0, 2*Math.PI, true);
		context.closePath();
		context.fill();
	}

	function drawMoveCircle() {
		var moveAngle = 2 * Math.PI / 180 ,
			angle = ++ count * moveAngle,
			r = moveCircle.radius,
			R = fixedCircle.radius,
			realRaduis = r,
			
			x0, y0, sumSquaresSqrt, distance,
			p1 = {}, p2 = {}, p3 = {}, p4 = {}, p5 = {},
			alpha, beta, gama, cta,
			x = moveCircle.x = box.x + (box.radius - fixedCircle.radius) * Math.sin(angle),
			y = moveCircle.y = box.y - (box.radius - fixedCircle.radius) * Math.cos(angle);
			num = isIntersect();
			//console.log(num)

		;context.clearRect(moveCircle.beforeX - 2 * r, moveCircle.beforeY - 2 * r, r * 4, r * 4);
		initFixed(box, fixedCircle.radius);
		if ( num !== false ) {
			
			x0 = fixedCircle.x[num];
			y0 = fixedCircle.y[num];
			distance = Math.sqrt( (moveCircle.x - fixedCircle.x[num]) * (moveCircle.x - fixedCircle.x[num]) +
				(moveCircle.y - fixedCircle.y[num]) * (moveCircle.y - fixedCircle.y[num]) )
			r = r + (1 - distance / (R + r)) * r;
			sumSquaresSqrt = Math.sqrt( (x0 - x) * (x0 - x) + (y0 - y) * (y0 - y) );

			alpha = Math.atan( (y0 -y) / (x0 -x) );
			gama = Math.asin( (R - r) / sumSquaresSqrt );
			beta = Math.PI / 2 - gama - alpha;
			cta = alpha + gama;
			p1 = {
				x: x - r * Math.cos(beta),
				y: y + r * Math.sin(beta)
			};

			p2 = {
				x: x0 - R * Math.sin(cta),
				y: y0 + R * Math.cos(cta)
			};
			p3 = {
				x: x + r * Math.sin(beta),
				y: y - r * Math.cos(beta)
			};
			p4 = {
				x: x0 + R * Math.cos(cta),
				y: y0 - R * Math.sin(cta)
			};
			p5 = {
				x: (x0 + x) / 2,
				y: (y0 + y) / 2
			};

			context.save();
			context.moveTo(p1.x, p1.y);
			context.quadraticCurveTo(p5.x, p5.y, p2.x, p2.y);
			context.lineTo(p4.x, p4.y);
			context.quadraticCurveTo(p5.x, p5.y, p3.x, p3.y);
			context.lineTo(p1.x, p1.y);
			context.fillStyle = '#46B9FF';
			context.fill();
			context.restore();
			
		}

		drawCircle(x, y, r, '#46B9FF');
/*		drawCircle(moveCircle.x, moveCircle.y, 1, 'yellow');
		drawCircle(fixedCircle.x[0], fixedCircle.y[0], 1, 'red');
		console.log( moveCircle.x - fixedCircle.x[0] , Math.pow(moveCircle.y - fixedCircle.y[0]) )*/

/*			drawCircle(p1.x, p1.y, 2, "yellow")
			drawCircle(p2.x, p2.y, 3, "gray")
			drawCircle(p3.x, p3.y, 2, "black")
			drawCircle(p4.x, p4.y, 2, "blue")
			drawCircle(p5.x, p5.y, 2, "yellow")
*/		moveCircle.beforeX = x;
		moveCircle.beforeY = y;
		requestAnimationFrame(drawMoveCircle);
	}

	function isIntersect() {
		var i = 0, len = fixedCircle.x.length;
		for (; i < len; i ++) {
			if (Math.sqrt( (moveCircle.x - fixedCircle.x[i]) * (moveCircle.x - fixedCircle.x[i]) +
				(moveCircle.y - fixedCircle.y[i]) * (moveCircle.y - fixedCircle.y[i]) ) < 
				(moveCircle.radius + fixedCircle.radius) ) {
				break;
			}
		}
		return i !== len ? i : false;
	}
})();