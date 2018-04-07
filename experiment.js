/**
*** RS1 - 
*** By: Geeticka Chauhan
*** Collaborators: (from PS2) Maroula Bach, Sayeri Lal, Vaikkunth Mugunthan, Jessica Raquelle; none this time
*** Thanks to stack overflow and MDN for JS syntax and MIT 6.813 course staff for answering piazza q's
*** External libraries:
***     JQUERY https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
***     BOOTSTRAP CSS stylesheet https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
***     BOOTSTRAP JS FILE https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
Please note: Bootstrap is not used for responsiveness, only aesthetics of the buttons and other elements
**/

// Hand it in this way: for simpler testing, always use the same seed.
Math.seedrandom(0);

var target_generated = 0;
var data; // store the data for all the sessions, gets incremented
var _width = 1000, _height = 600; // width and height of the drawing area.
var _target = null; // this is the current target
var captured = null;
var _starttime, _endtime;
var _screenwidth, _screenheight;
var _cursor = "bubble"; // controls whether the cursor is a bubble cursor
// target is always circle with id 0

// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {
        _screenwidth = document.documentElement.clientWidth;
        _screenheight = document.documentElement.clientHeight;
    distractor_density = {0.05: 1, 0.1: 5, 0.8: 10};
    density = 0.8; // we vary density from 0.05, 0.2, 0.8 which corresponds to distractor densities of 
        // 0, 0.5 and 1
	drawcircles(40, density, 10, distractor_density[density]);
    // 40 should be the max padding.
    
    delay_time = {0.05: '2500', 0.1: '5000', 0.8: '7000'};
    promise = Util.delay(delay_time[density]);
        promise.then(function(){
        target = document.getElementById("0");
        console.log(target);
        _target = target;
        cx = parseFloat(target.getAttribute("cx"));
        cy = parseFloat(target.getAttribute("cy"));
        drawarea_elt = document.getElementById("draw-area");
        var offset = Util.offset(drawarea_elt);
//        console.log(cx, cy); 
            // try not to make it too far away
        foundpoint = getstartpoint(768, cx, cy, offset);
        console.log(foundpoint[0], foundpoint[1]);
            
        var d = document.getElementById('start-button');
        d.style.position = "absolute";
        d.style.left = foundpoint[0]+'px';
        d.style.top = foundpoint[1]+'px';
        d.innerHTML = "<input class='btn btn-info' onclick='fillCircle()' type='button' id='start' value='Start'>";
        
        target.addEventListener('click', function(){
            target_onclick();
            
            
            // when they click the target a new experiment should start
            // also implement the bubble cursor this way as well
            // when this is clicked, the time should stop being captured
        });
//        console.log(answer[0], answer[1]);
        // this start button starts everything
        });
    
//    console.log(getstartpoint(300, cx, cy));
    // specify the target and then calculate the starting point based upon amplitude.
        
    // basically above is effective width (EW), density (D) and target width (W)
    // then do amplitude by simply shifting the mouse in any direction at a particular distance from the target
        // there are 3 distractor targets which have the same size as the target
        // density varied between distracter density D (0, 0.5, 1)
        
        
// CT (Point, Bubble), amplitude A (256, 512, 768 units), width W (8, 16, 32 units), effective width to width ratio EW/W (1.33, 2, 3), and distracter density D (0, 0.5, 1). A fully crossed design resulted in 243 combinations of CT, A, W, and EW/W. Each participant performed the experiment in one session lasting approximately 90 minutes. The session was broken up by cursor type, with 4 blocks of trials completed for each cursor. In each block participants would complete trial sets for each of the 27 combinations of W, EW/W, and D presented in random order. A trial set consisted of selecting 9 targets in sequence (not counting the initial click on the start target).
        
        // before doing anything further i.e. allowing clicking of a target or finding a target, 
        // make sure to add a delay of 10 sec to be safe; but remove this delay from effective time 
        // only start calculating effective time within the Util.delay method
        
    // one of them, which is the target node will have the width 10
//	
//	$("circle").mouseover(function() {	
//			$(this).attr('fill', '#'+ Math.floor(Math.random()*16777215).toString(16));
//			$(this).fadeOut(500, function() {
//        $(this).attr('cx', Math.floor(Math.random() * (1400-100+1)+ 100));
//        $(this).attr('cy', Math.floor(Math.random() * (1400-100+1)+ 100));
//        $(this).fadeIn(500);
//    });
//			}).mouseout(function(){
//      $(this).attr('fill', '#'+ Math.floor(Math.random()*16777215).toString(16));
//	});
        
           
    },
        
 
    // Keyboard events arrive here
    "keydown": function(evt) {
      
    },
	// Click events arrive here
	"click": function(evt) {
		// Your code here
	}
});
function fillCircle(){
    _target.style.setProperty('fill', 'var(--color-green)');
    _starttime = Date.now();
    
    start_button = document.getElementById('start-button');
    removeAllChildren(start_button);
    
    if(_cursor == "bubble"){
    // below is only if bubble cursor is activated
        body = document.querySelector('html');
        body.style.setProperty('cursor', 'none'); 
        // can make the cursor disappear and just create a circle that follows the movement
        document.onmousemove = onMouseMove;
    }
    // then just create an SVG circle that tracks the mouse on mousemove. 
    // this is where you want to start the bubble cursor
}
function target_onclick(){
    _endtime = Date.now();
    diff = _endtime - _starttime;
    console.log("Time difference in ms", diff);
}
function onMouseMove(e){
    // insert an svg circle that tracks the mouse movement. Basically it's cx and cy follow it
    var d = document.getElementById('bubble-cursor');
    d.style.position = "absolute";
    var val = calculate_distance(e.clientX, e.clientY); // just check your method for calculation
    var drawarea_elt = document.getElementById("draw-area");
    var offset = Util.offset(drawarea_elt);
    var radius = val[0];
    var captured_circleID = val[1];
    if(captured_circleID != null){
        captured_circle = document.getElementById(captured_circleID +"");
        _captured = captured_circle;
        d2 = document.getElementById('bubble-cursor2');
        d2.style.position = "absolute";
        cx = parseFloat(captured_circle.getAttribute('cx'));
        cy = parseFloat(captured_circle.getAttribute('cy'));
        r = parseFloat(captured_circle.getAttribute('r')) + 4;
        d2.style.setProperty('left', (cx + offset.left - r) + "px");
        d2.style.setProperty('top', (cy + offset.top - r) + "px");
        d2.style.setProperty('width', (2*r)+ "px");
        d2.style.setProperty('height', (2*r)+ "px");
        temp2 = '<circle r="'+(r)+'px" cx="50%" cy="50%" fill="var(--color-light-aqua)" />'
        var svg2 ='<svg id="bubble-cursor2-svg" xmlns="http://www.w3.org/2000/svg"> ' + temp2 + '</svg>';
	   d2.innerHTML = svg2;
    }
    
    // it's probably buggy, then you should be able to capture and after that run the experiment
//    l = e.clientX - radius;
//    t = e.clientY - radius; // bubble cursor is a little buggy
    l = Math.min(e.clientX - radius, _screenwidth - radius);
    t = Math.min(e.clientY - radius, _screenheight - radius); 
    //    left = Math.min(e.clientX - radius, _screenwidth - radius);
//    top = Math.min(e.clientY - radius, _screenheight - radius);
    d.style.setProperty('left', l + "px");
    d.style.setProperty('top', t + "px");
    d.style.setProperty('width', 2*radius + "px");
    d.style.setProperty('height', 2*radius + "px");
//    d.style.setProperty('background', 'var(--color-red)');
   
//    temp = '<circle cx="'+(e.clientX -10)+'" cy="'+(e.clientY-10)+'" r="' + 10 + '" fill="var(--color-blue)"/>';
    // above will update the radius 
    temp = '<circle r="'+radius+'px" cx="50%" cy="50%" fill="var(--color-light-aqua)" />'
    var svg ='<svg id="bubble-cursor-svg" xmlns="http://www.w3.org/2000/svg"> ' + temp + '</svg>';
    svg += ' <img src="crosshair.png"/>'
	d.innerHTML = svg;
    document.onclick = onClick;
    

}
function onClick(e){
    if(e.button == 0){
        if(_captured == _target){
            target_onclick();
            // here we can simulate the start of the next experiment
        }
    }
}
// detects whether there was a left button press
//function detectLeftButton(evt) {
//    evt = evt || window.event;
//    if ("buttons" in evt) {
//        return evt.buttons == 1;
//    }
//    var button = evt.which || evt.button;
//    return button == 1;
//}

// does the distance calculation for conD and inJ
function calculate_distance(sx, sy){
    // first read all circles inside the draw area svg and then find the distance to the circle
    svg = document.getElementById("draw-area").firstChild;
    circles = svg.childNodes;
    var min_distance = Math.sqrt(_width * _width + _height * _height);
    var s_min_distance = min_distance; // second min distance
    var min_r;
    var s_min_r;
    var min_id;
    var s_min_id;
    drawarea_elt = document.getElementById("draw-area");
    var offset = Util.offset(drawarea_elt);
    for(i=0; i<circles.length; i++){
        var cx = parseFloat(circles[i].attributes[4].nodeValue) + offset.left;
        var cy = parseFloat(circles[i].attributes[5].nodeValue) + offset.top;
        var r = parseFloat(circles[i].attributes[0].nodeValue);
        var x = parseFloat(sx)-cx;
        var y = parseFloat(sy)-cy;
        var distance = Math.sqrt(x*x + y*y);
        distance = distance - r; 
        if(distance <= s_min_distance && min_distance < distance){
            s_min_distance = distance;
            s_min_id = circles[i].attributes[2].nodeValue;
            s_min_r = r;
        }
        else if(distance <= min_distance){
            s_min_distance = min_distance;
            s_min_id = min_id;
            s_min_r = min_r;
            min_distance = distance;
            min_id = circles[i].attributes[2].nodeValue;
            min_r = r;
        }  s_min_r = r;
    }
    
    var ConD = min_distance + min_r;
    var IntD = s_min_distance;
    return [Math.min(ConD, IntD), min_id];
    
//    var indexCloset = 0; 
//			var indexSecClosest = 0;
//			var closestDistance = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
//			var secondClosestDis = closestDistance
//
//			for (var index = 0; index < board.circles.length; index++) { 
//				var dis = pos.minus(board.circles[index].pos).norm();
//				if ( dis <= secondClosestDis && closestDistance < dis) {
//					secondClosestDis = dis;
//					indexSecClosest = index;
//				} else if (dis <= closestDistance) {
//					secondClosestDis = closestDistance;
//					indexSecClosest = indexCloset;
//					indexCloset = index;
//					closestDistance = dis;
//					this.capturedCircle = board.circles[index];
//				}
//
//				var ConD = closestDistance + this.capturedCircle.w;
//				var IntD = secondClosestDis - this.capturedCircle.w;
//
//				this.radius = Math.min(ConD, IntD);
//    
//    return Math.min(min_distance - min_r, s_min_distance - s_min_r);
//    circles =  
    // read the cx and cy of each circle and then find the distance to it  
}
/*
Remove all children of an element
*/
function removeAllChildren(elt) {
    if(elt == null){
        return;
    }
  while (elt.hasChildNodes()) {
    clear(elt.firstChild);
  }
}
/*
helper method to clear first child recursively
*/
function clear(elt) {
  while (elt.hasChildNodes()) {
    clear(elt.firstChild);
  }
  elt.parentNode.removeChild(elt);
}
// start at a particular point - make the user click there to start the experiment, then show the target. 
// above will control the amplitude

// instead of doing below, try to make set points on which you can draw circles, but 
// only select a random number of points to actually draw them on, while picking the 
function drawcircles(p, density, w, distractor){
    // density is defined as the number of circles. Make density a number between 4 and 100
    // W is dependent on max radius
    // A is amplitude which is distance to target. Just make the starting position of mouse such
    // that the distance from target is the amplitude
    
    
    // let's divide the units by 2
    // effective width can be changed by padding because it is defined as a square
    
     // using https://bl.ocks.org/mbostock/1748247 as a basis
    
    var padding = p, // separation between same-color circles
    clusterPadding = 10, // separation between different-color circles
    maxRadius = 12,
    counter = 0, // provide ids to all circles
    minRadius = 3;
    
    var n = 100 * density, // total number of circles
        m = 1; // number of distinct clusters
        
//    var color = d3.scale.category10()
//        .domain(d3.range(m));

    // The largest node for each cluster.
    var clusters = new Array(m);

    var nodes = d3.range(n).map(function() {
      var i = Math.floor(Math.random() * m),
          r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
          d = {cluster: i, radius: r};
//        if(r<minRadius){
//            r = minRadius;
//            d = {cluster: i, radius: r};
//        }
        if(target_generated < distractor){
            r = w;
            d = {cluster: i, radius: r};
            target_generated ++;
        }
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    });

    var force = d3.layout.force()
        .nodes(nodes)
        .size([_width, _height])
        .gravity(0)
        .charge(0)
        .on("tick", tick)
        .start();

    var svg = d3.select("#draw-area").append("svg");
    
    var circle = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", function(d) { return d.radius; })
        .attr("class", "disk")
        .attr("id", function(d){ return counter++;})
        .style("fill", "var(--color-light-gray)");
//        .call(force.drag);
    
    target_generated = 0;
    console.log(target_generated);
    function tick(e) {
      circle
          .each(cluster(2 * e.alpha * e.alpha))
//          .each(moveawayfromedge())
          .each(collide(.1))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
        
        // place the target at a particular cx and cy depending on the initial mouse position 
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) { // don't apply to the target
      return function(d) {
        var cluster = clusters[d.cluster],
            k = 1;

        // For cluster nodes, apply custom gravity.
        if (cluster === d) {
          cluster = {x: _width / 2, y: _height / 2, radius: -d.radius};
          k = .1 * Math.sqrt(d.radius);
        }

        var x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + cluster.radius;
        if (l != r) {
          l = (l - r) / l * alpha * k;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      };
    }
    
    function moveawayfromedge(){ // this does not work
        return function(d){
            r = d.radius + padding;
            drawarea_elt = document.getElementById("draw-area");
            var offset = Util.offset(drawarea_elt);
            if(d.x > offset.left & d.y > offset.top & d.x < offset.left + _width & d.y < offset.top + _height ){
                if(d.x - r < offset.left){
                    d.x += offset.left - d.x + r;
                }
                else if(d.x + r > offset.left + _width){
                    d.x -= d.x + r - offset.left + _width;
                }
                if(d.y - r < offset.top){
                    d.y += offset.top - d.y + r;
                }
                else if(d.y + r > offset.top + _height){
                    d.y -= d.y + r - offset.top + _height;
                }
            }
            else{
                if(d.x < offset.left){
                    d.x += offset.left - d.x + r;
                }
                else if(d.x > offset.left + _width){
                    d.x = d.x - (offset.left + _width) - r;  
                }
                if(d.y < offset.top){
                    d.y += offset.top - d.y + r;
                }
                else if(d.y > offset.top + _height){
                    d.y = d.y - (offset.top + _height) - r;
                }
                
            }
        }
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) { // don't apply to the target
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + padding, // some had maxRadius in there also
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
}

// given the amplitude, cx and cy of target, specify the start point inside the canvas. 
function getstartpoint(A, cx, cy, offset){
    Math.seedrandom();
    var randomAngle = Math.PI * (2 * Math.random() - 1); 
    tarX = cx + A*Math.cos(randomAngle);
    tarY = cy + A*Math.sin(randomAngle);
//    $(window).height();   // returns height of browser viewport
//$(document).height(); // returns height of HTML document (same as pageHeight in screenshot)
//$(window)._width();   // returns width of browser viewport
//$(document).width(); // returns width of HTML document (same as pageWidth in screenshot)
    // use above to make sure the tarX and tarY are not outside the height and width
    var window_height = document.documentElement.clientHeight;
    var window_width = document.documentElement.clientWidth;
    while(tarX < 0 || tarY < 0 || tarX > window_width || tarY > window_height){
        var randomAngle = Math.PI * (2 * Math.random() - 1); 
        tarX = cx + A*Math.cos(randomAngle);
        tarY = cy + A*Math.sin(randomAngle);
    }

    console.log("done finding");
	return [tarX, tarY];
}
//below is useful for above 



function existOnBoard(x, y, offset){
    if(x > offset.left & y > offset.top & x < offset.left + _width & y < offset.top + _height){
        return true;
    }
    else{
        return false;
    }
}



// will want to delete below


// can also just use below
/* return a random position on canvas */
var randomPos = function() {
	var p = new Pos(Math.random() * _width, Math.random() * _height);
	return p;
}

/* examine wheterh the tarPos is qualified to be created on canvas (together with its nearest)
 * four distractors. */
var examineTarPos = function(tarPos, ranw, raneww) {
	var margin = ranw * raneww * 3 / Math.sqrt(2);
	return ((tarPos.x > margin) && (tarPos.x < (_width - margin)) && (tarPos.y > margin) && (tarPos.y < (_height - margin)))
}

/* check if a center of a circle can appear on the canvas */
var qualifyOnCanvas = function(pos, w) {
	/*
	console.log('pox.x is ' + pos.x);
	console.log('pos.y is ' + pos.y);
	*/
	if ((w <= pos.x) && (pos.x <= (_width - w)) && (w <= pos.y) && (pos.y <= _height - w)) {
		/*console.log("on canvas");*/
		return true;
	} else {
		/*console.log('not on canvas');*/
		return false;
	}
}

/* Find a random Posistion on canvas which has the required A, w, eww from curPos. */
var randomTarPos = function(curPos, ranA, ranw, raneww) {
	var randomAngle = Math.PI * (2 * Math.random() - 1);
	var tarPos = curPos.add(new Pos(ranA * Math.cos(randomAngle), ranA * Math.sin(randomAngle)));
	var qualified = examineTarPos(tarPos, ranw, raneww);
	while (!qualified) {
		randomAngle = Math.PI * (2 * Math.random() - 1);
		tarPos = curPos.add(new Pos(ranA * Math.cos(randomAngle), ranA * Math.sin(randomAngle)));
		qualified = examineTarPos(tarPos, ranw, raneww);
		/* debug use
		console.log("Loop once to find a tarPos.")
		*/
	}
	return tarPos;
}
