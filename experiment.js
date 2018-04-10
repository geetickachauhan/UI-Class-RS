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
//Math.seedrandom(0);

var target_generated = 0;


var _target = null; // this is the current target
var _captured = null;
var _starttime = null, _endtime = null;
var _start_pressed = false;
var _A, _w, _eww, _D;

// incremented vars
var _experiment_num = 1;
var _data = []; // store the data for all the sessions, gets incremented

// following are fixed globals
var dom = {};
var _width = 1000, _height = 600; // width and height of the drawing area.
var _screenwidth, _screenheight;
var _unit = 0.5;
var _distractor_density = {0.05: 5, 0.4: 10, 0.8: 20};
var _delay_time = {0.05: '500', 0.1: '1000', 0.8: '1500'};
var _name, _age, _gender, _cursor;
var _independent_vars;
//var _delay_time = {0.05: '2500', 0.1: '5000', 0.8: '7000'};
// target is always circle with id 0

// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {
        dom.currentexp = Util.one('#current-exp');
        dom.drawarea = Util.one('#draw-area');
        dom.startbutton = Util.one('#start-button');
        dom.bubblecursor = Util.one('#bubble-cursor');
        dom.bubblecursor2 = Util.one('#bubble-cursor2');
        dom.cursor = Util.one('#cursor'); // to change the cursor text to bubble cursor versus normal 
        dom.download = Util.one('#download');
        dom.downloadtext = Util.one('#download-text');
        // TODO: see if maybe others can be put in this way
        
        _screenwidth = document.documentElement.clientWidth;
        _screenheight = document.documentElement.clientHeight;
        _name = sessionStorage.getItem('name');
        _age = sessionStorage.getItem('age');
        _gender = sessionStorage.getItem('gender');
        _cursor = sessionStorage.getItem('cursor');
        dom.cursor.innerHTML = _cursor[0].toUpperCase() + _cursor.substring(1);
        // above would be experiment 0
        
        startAllExperiments();
//        A = [256*_unit, 512*_unit, 768*_unit];
//        w = [8*_unit, 16*_unit, 32*_unit];
//        eww = [1.33, 2, 3];
//        D = [0.05, 0.1, 0.8];
//        startExperiment(A[2], w[2], eww[2], D[2]);
        // somehow want to increase padding to make it look nicer. 
        // I think I need to deal with eww/w in a different way
        // generate the 4 distractors around and the rest make them not charge towards each other
        // a way to do that is to generate one big circle with the id of 6 and the inner circles will then 
        // be fixed. That one big circle's radius depends on eww/w ratio
        // width is good as 4, 8, 16 units; A is better if divided by 2
        
        // in above case, 3-4-5 works; everything else is divided by 2
        
        // density varied between distracter density D (0, 0.5, 1)
        
        
// CT (Point, Bubble), amplitude A (256, 512, 768 units), width W (8, 16, 32 units), effective width to width ratio EW/W (1.33, 2, 3), and distracter density D (0, 0.5, 1). A fully crossed design resulted in 243 combinations of CT, A, W, and EW/W. Each participant performed the experiment in one session lasting approximately 90 minutes. The session was broken up by cursor type, with 4 blocks of trials completed for each cursor. In each block participants would complete trial sets for each of the 27 combinations of W, EW/W, and D presented in random order. A trial set consisted of selecting 9 targets in sequence (not counting the initial click on the start target).  
           
    },
        
 
    // Keyboard events arrive here
    "keydown": function(evt) {
      
    },
	// Click events arrive here
	"click": function(evt) {
		// Your code here
	}
});

function startExperiment(A, w, eww, D, currentExperiment){
//    density = 0.8; // we vary density from 0.05, 0.2, 0.8 which corresponds to distractor densities of 
            // 0, 0.5 and 1
//    promise = Util.when('experimentdone');
//    promise1 = Util.when('experimentdone');
//    console.log("start experiment is waiting for experiment" + (currentExperiment -1));
//    promise1 = Util.when(window, 'experiment'+(currentExperiment-1)+'done');
//    promise1.then(function(){
    _A = A;
    _w = w;
    _eww = eww;
    _D = D;
    padding = (eww*w - 2*w)/2;
    drawcircles(padding, D, w, _distractor_density[D]);

    // 40 should be the max padding.
    // eww*w is the effective width - padding should be (eww*w - 2*w)/2
    
//    promise = Util.delay(_delay_time[D]);
    // console.log("start experiment is waiting for circles" + currentExperiment);
    promise = Util.when(window, "circle"+currentExperiment+"done");
    promise.then(function(){
        // console.log("circles done");
        target = document.getElementById("0");
        // console.log(target);
        _target = target;
        var cx = parseFloat(target.getAttribute("cx"));
        var cy = parseFloat(target.getAttribute("cy"));
        var drawarea_elt = dom.drawarea;
        var offset = Util.offset(drawarea_elt);
        // console.log(cx, cy, offset); 
            // try not to make it too far away
        foundpoint = getstartpoint(A, cx, cy, offset);
        // console.log("found points",foundpoint[0], foundpoint[1]);
    

        var d = dom.startbutton;
        d.style.position = "absolute";
        d.style.left = foundpoint[0]+'px';
        d.style.top = foundpoint[1]+'px';
        d.innerHTML = "<input class='btn btn-info' onclick='fillCircle()' type='button' id='start' value='Start'>";
        
        // console.log(target, "is target");
        target.addEventListener('click', function(){
            target_onclick();
        });
//        console.log(answer[0], answer[1]);
    // this start button starts everything
    });
//});
}
// this is the onclick for start button
function fillCircle(){
    _start_pressed = true;
    _target.style.setProperty('fill', 'var(--color-green)');
    _starttime = Date.now();
    
    start_button = document.getElementById('start-button');
    removeAllChildren(start_button);
    
    if(_cursor == "bubble"){
    // below is only if bubble cursor is activated
        html = document.querySelector('html');
        html.style.setProperty('cursor', 'none'); 
        // can make the cursor disappear and just create a circle that follows the movement
        document.onmousemove = onMouseMove;
    }
    // then just create an SVG circle that tracks the mouse on mousemove. 
    // this is where you want to start the bubble cursor
}
function target_onclick(){
    if(_start_pressed == false){
        return;
    }
    _endtime = Date.now();
    diff = _endtime - _starttime;
    // console.log("Time difference in ms", diff);
    
    // TODO: update the data here and also remove all children from different places
    // TODO: update all the global variables in target_onclick()
    html = document.querySelector('html');
    html.style.setProperty('cursor', 'default');
    _data.push({'Name':_name, 'Age':_age, 'Gender':_gender, 'Cursor':_cursor, 'A': _A, 'w': _w, 'eww': _eww, 'Total-Density':_D, 'Distractors': (_distractor_density[_D] - 1), 'Time(ms)': diff}); 
    _A = null;
    _w = null;
    _eww = null;
    _D = null;
    _target = null; // this is the current target
    _captured = null;
    _starttime = null, _endtime = null;
    _start_pressed = false;
    _experiment_num++;
    dom.currentexp.innerHTML = _experiment_num;
    removeAllChildren(dom.drawarea);
    removeAllChildren(dom.startbutton);
    dom.startbutton.removeAttribute('style');
    removeAllChildren(dom.bubblecursor);
    dom.bubblecursor.removeAttribute('style');
    removeAllChildren(dom.bubblecursor2);
    dom.bubblecursor2.removeAttribute('style');
    document.onmousemove = null;
    document.onclick = null;
    
    window.dispatchEvent(new CustomEvent("experiment"+(_experiment_num - 1)+"done"));
    // console.log("Dispatched experiment"+(_experiment_num -1));
    vals = _independent_vars.next();
    if(vals!= null){
        startExperiment(vals[0], vals[1], vals[2], vals[3], _experiment_num);
    }
    if(vals == null){
        // TODO: we have reached the end of the experiment
        // show the download button and add an event listener to download the data
        console.log(_data);
        elements = document.querySelectorAll('.bottom-row-part');
        for(i=0; i<elements.length; i++){
            removeAllChildren(elements[i]);
        }
        dom.downloadtext.innerHTML = "You have reached the end of the experiment! Please download the data.";
        d = dom.download;
        d.innerHTML = "<input class='btn btn-light' onclick='download()' type='button' id='download-button' value='Download'>";
        d2 = Util.one('#bottom-row');
        d2.style.setProperty('flex-flow', 'column');
    }
    // simply call the next startexperiment over here. 
}
function download(){
    var fileName = _name + '_' + _cursor;
    var CSV = JSONToCSV(_data, _name + " performed this experiment using " +_cursor + " cursor");
    fileName = fileName.split(' ').join('_');
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement('a');
    link.href = uri;
    link.style = 'visibility: hidden';
    link.download = fileName + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function onMouseMove(e){
    // insert an svg circle that tracks the mouse movement. Basically it's cx and cy follow it
    var d = dom.bubblecursor;
    d.style.position = "absolute";
    var val = calculate_distance(e.clientX, e.clientY); // just check your method for calculation
    // TODO: IMP check why the above is null
    var drawarea_elt = dom.drawarea;
    var offset = Util.offset(drawarea_elt);
    var radius = val[0];
    var captured_circleID = val[1];
    if(captured_circleID != null){
        captured_circle = document.getElementById(captured_circleID);
        _captured = captured_circle;
        d2 = dom.bubblecursor2;
        d2.style.position = "absolute";
        cx = parseFloat(captured_circle.getAttribute('cx'));
        cy = parseFloat(captured_circle.getAttribute('cy'));
        r = parseFloat(captured_circle.getAttribute('r')) + 4; // 4 is so that we can have bubble cursor 
        // circle bigger
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
    var svg = document.getElementById("draw-area").firstChild;
    var circles = svg.childNodes;
//    console.log("in calculate distance");
//    console.log("grabbing the circles",circles);
    var min_distance = Math.sqrt(_width * _width + _height * _height);
    var s_min_distance = min_distance; // second min distance
    // console.log("min_distance, s_min_distance", min_distance, s_min_distance);
    var min_r;
    var s_min_r;
    var min_id;
    var s_min_id;
    drawarea_elt = document.getElementById("draw-area");
    var offset = Util.offset(drawarea_elt);
    // console.log("offset", offset);
    for(i=0; i<circles.length; i++){
//        var cx = parseFloat(circles[i].attributes[4].nodeValue) + offset.left;
//        var cy = parseFloat(circles[i].attributes[5].nodeValue) + offset.top;
//        var r = parseFloat(circles[i].attributes[0].nodeValue);
        var cx = parseFloat(circles[i].getAttribute('cx')) + offset.left;
        var cy = parseFloat(circles[i].getAttribute('cy')) + offset.top;
        var r = parseFloat(circles[i].getAttribute('r'));
        
        // console.log("cx, cy, r, sx, sy", cx, cy, r, sx, sy);
        var x = parseFloat(sx)-cx;
        var y = parseFloat(sy)-cy;
        var distance = Math.sqrt(x*x + y*y);
        distance = distance - r; 
        // console.log("distance", distance);
        if(distance <= s_min_distance && min_distance < distance){
            s_min_distance = distance;
//            s_min_id = circles[i].attributes[2].nodeValue;
            s_min_id = circles[i].getAttribute('id');
            s_min_r = r;
            // console.log("first if and s_min_distance", s_min_distance );
        }
        else if(distance <= min_distance){
            s_min_distance = min_distance;
            s_min_id = min_id;
            s_min_r = min_r;
            min_distance = distance;
//            min_id = circles[i].attributes[2].nodeValue;
            min_id = circles[i].getAttribute('id');
            min_r = r;
            // console.log("second if and s_min_distance and min_distance", s_min_distance, min_distance);
//            s_min_r = r;
        }  
    }
    
    var ConD = min_distance + min_r;
    var IntD = s_min_distance;
    // console.log("ConD IntD", ConD, IntD);
    return [Math.min(ConD, IntD), min_id];
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
            target_generated++;
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
    .on('end', function(){
            // console.log("circle"+_experiment_num+" done");
          window.dispatchEvent(new CustomEvent("circle"+_experiment_num+"done"));
    })
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
   
    
//    target.style.setProperty('fill', 'var(--color-green)');
    // can color the target here if in the future need to color the target before.
    target_generated = 0;
    // console.log(target_generated);
    function tick(e) {
      circle
//          .each(cluster(2 * e.alpha * e.alpha))
          .each(moveawayfromedge())
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
    
    function moveawayfromedge(){
        return function(d){
            r = d.radius;
            if(d.x > 0 & d.y > 0 & d.x < _width & d.y < _height ){
                if(d.x - r < 0){
                    d.x += r - d.x;
                }
                else if(d.x + r > _width){
                    d.x -= d.x + r - _width;
                }
                if(d.y - r < 0){
                    d.y += r - d.y;
                }
                else if(d.y + r > _height){
                    d.y -= d.y + r - _height;
                }
            }
            else{
                if(d.x < 0){
                    d.x += - d.x + r;
                }
                else if(d.x > _width){
                    d.x -= d.x - _width - r;  
                }
                if(d.y < 0){
                    d.y += - d.y + r;
                }
                else if(d.y > _height){
                    d.y -= d.y - _height - r;
                }
                
            }
        }
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) { // don't apply to the target
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + padding + maxRadius, // some had maxRadius in there also
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
    while(tarX < 0 || tarY < 0 || tarX > (window_width - 0.05*window_width) || tarY > (window_height - 0.05*window_height)){
        var randomAngle = Math.PI * (2 * Math.random() - 1); 
        tarX = cx + A*Math.cos(randomAngle);
        tarY = cy + A*Math.sin(randomAngle);
    }

    // console.log("done finding");
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

function startAllExperiments(){
//    A = [256*_unit, 512*_unit, 768*_unit];
//    w = [8*_unit, 16*_unit, 32*_unit];
//    eww = [1.33, 2, 3];
//    D = [0.05, 0.4, 0.8];
    A=[256*_unit];
    w = [8*_unit];
    eww = [1.33];
    D=[0.05];
    _independent_vars = Combinatorics.cartesianProduct(A, w, eww, D);
//    _independent_vars =  _independent_vars.toArray();
    window.dispatchEvent(new CustomEvent("experiment0done"));
    vals = _independent_vars.next();
    if(vals!= null){
        startExperiment(vals[0], vals[1], vals[2], vals[3], _experiment_num);
    }
}
/* convert a Json into a csv file */
var JSONToCSV = function(data, reportTitle) {
	var CSV = '';
	CSV += reportTitle + '\r\n\n'

	var row = '';
	for (var index in data[0]) {
		row += index + ',';
	}
	row = row.slice(0, -1);
	CSV += row + '\r\n';

	for (var i = 0; i < data.length; i++) {
		var row = '';
		for (var index in data[i]) {
			row += data[i][index] + ',';
		}
		row = row.slice(0, -1);
		CSV += row + '\r\n';
	}
	return CSV;
}