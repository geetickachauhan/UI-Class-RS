/**
*** RS1
*** By: Geeticka Chauhan
*** Collaborators: Maroula Bach
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
var _num_clicks = 0; // number of clicks made before the target was selected

// incremented vars
var _experiment_num = 1;
var _data = []; // store the data for all the sessions, gets incremented

// following are fixed globals
var dom = {};
var _width = 1000, _height = 600; // width and height of the drawing area.
var _screenwidth, _screenheight;
var _unit = 1;
var _distractor_density = {0.05: 5, 0.4: 10, 0.8: 20};
var _delay_time = {0.05: '500', 0.1: '1000', 0.8: '1500'};
var _name, _age, _gender, _cursor, _experiments;
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
        dom.totalexp = Util.one('#total-exp');
        
        _screenwidth = document.documentElement.clientWidth;
        _screenheight = document.documentElement.clientHeight;
        _name = sessionStorage.getItem('name');
        _age = sessionStorage.getItem('age');
        _gender = sessionStorage.getItem('gender');
//        _cursor = sessionStorage.getItem('cursor');
        _experiments = sessionStorage.getItem('experiments');
//        dom.cursor.innerHTML = _cursor[0].toUpperCase() + _cursor.substring(1);
        startAllExperiments();
    }
});

/*
This function starts one of the experiments
*/
function startExperiment(A, w, eww, D, cursor, currentExperiment){
    _A = A;
    _w = w;
    _eww = eww;
    _D = D;
    _cursor = cursor;
    dom.cursor.innerHTML = _cursor[0].toUpperCase() + _cursor.substring(1);
    padding = (eww*w - 2*w)/2; // should be divided by 2
    drawcircles(padding, D, w, _distractor_density[D]);
    promise = Util.when(window, "circle"+currentExperiment+"done");
    promise.then(function(){
        target = document.getElementById("0");
        _target = target;
        var cx = parseFloat(target.getAttribute("cx"));
        var cy = parseFloat(target.getAttribute("cy"));
        var drawarea_elt = dom.drawarea;
        var offset = Util.offset(drawarea_elt);
        foundpoint = getstartpoint(A, cx, cy, offset);
    
        // create the start button
        var d = dom.startbutton;
        d.style.position = "absolute";
        d.style.left = foundpoint[0]+'px';
        d.style.top = foundpoint[1]+'px';
        d.innerHTML = "<input class='btn btn-info' onclick='clickCircle()' type='button' id='start' value='Start'>";
        
        
    });
}
/*
This is the onclick for the start button
*/
function clickCircle(){
    _start_pressed = true;
//    _target.style.setProperty('fill', 'var(--color-green)');
    _starttime = Date.now();
    
    start_button = document.getElementById('start-button');
    removeAllChildren(start_button);
    // console.log(target, "is target");
    document.onclick = function(){_num_clicks++;}
    _target.addEventListener('click', function(){
        target_onclick();
    });
    
    if(_cursor == "bubble"){
    // below is only if bubble cursor is activated
        html = document.querySelector('html');
        html.style.setProperty('cursor', 'none'); 
        // can make the cursor disappear and just create a circle that follows the movement
        document.onmousemove = onMouseMove;
    }
}
/*
Start the next experiment on the click of the target circle
*/
function target_onclick(){
    if(_start_pressed == false){
        return;
    }
    _endtime = Date.now();
    diff = _endtime - _starttime;
    html = document.querySelector('html');
    html.style.setProperty('cursor', 'default');
    _data.push({'Name':_name, 'Age':_age, 'Gender':_gender, 'Cursor':_cursor, 'A': _A, 'w': _w, 'eww': _eww, 'Total-Density':_D, 'Distractors': (_distractor_density[_D] - 1), 'Time(ms)': diff, 'NumClicks': (_num_clicks -1)}); 
    // whenever NumClicks > 0, that counts as an error. Percentage of error depends on how many rows the NumClicks>0 for
    _A = null, _w = null, _eww = null, _D = null, _target = null, _captured = null, _starttime = null, _endtime = null, _start_pressed = false, _num_clicks = 0, _cursor= null;
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
    vals = _independent_vars.next();
    if(vals!= null){
        startExperiment(vals[0], vals[1], vals[2], vals[3], vals[4], _experiment_num);
    }
    if(vals == null){
        // this is when we reach the end of the experiment
        console.log(_data);
        sendToFormBubbleCursor(_data);
        elements = document.querySelectorAll('.bottom-row-part');
        for(i=0; i<elements.length; i++){
            removeAllChildren(elements[i]);
        }
        dom.downloadtext.innerHTML = "Congratulations! You have reached the end of the experiment! You may download the data if you wish.";
        d = dom.download;
        d.innerHTML = "<button class='btn btn-success' onclick='download()' type='button' id='download-button'><span class='glyphicon glyphicon-download-alt'></span></button>";
        d2 = Util.one('#bottom-row');
        d2.style.setProperty('flex-flow', 'column');
    }
}
/*
Create and download the CSV file
*/
function download(){
    var fileName = _name.toLowerCase();
    var CSV = JSONToCSV(_data, _name + " performed this experiment using both cursors");
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
/*
Activates the bubble cursor on mouse move
*/
function onMouseMove(e){
    // insert an svg circle that tracks the mouse movement. Basically it's cx and cy follow it
    var d = dom.bubblecursor;
    d.style.position = "absolute";
    var val = calculate_distance(e.clientX, e.clientY); // just check your method for calculation
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
    
    l = Math.min(e.clientX - radius, _screenwidth - radius);
    t = Math.min(e.clientY - radius, _screenheight - radius); 
    d.style.setProperty('left', l + "px");
    d.style.setProperty('top', t + "px");
    d.style.setProperty('width', 2*radius + "px");
    d.style.setProperty('height', 2*radius + "px");
    // above will update the radius 
    temp = '<circle r="'+radius+'px" cx="50%" cy="50%" fill="var(--color-light-aqua)" />'
    var svg ='<svg id="bubble-cursor-svg" xmlns="http://www.w3.org/2000/svg"> ' + temp + '</svg>';
    svg += ' <img src="crosshair.png"/>'
	d.innerHTML = svg;
    document.onclick = onClick;
    

}
/*
This is the onclick tracker for the bubble cursor
*/
function onClick(e){
    if(e.button == 0){
        if(_captured == _target){
            target_onclick();
            // here we can simulate the start of the next experiment
            _num_clicks++;
        }
    }
}

/*
does the distance calculation for conD and inJ to determine bubble cursor radius
*/
function calculate_distance(sx, sy){
    // first read all circles inside the draw area svg and then find the distance to the circle
    var svg = document.getElementById("draw-area").firstChild;
    var circles = svg.childNodes;
    var min_distance = Math.sqrt(_width * _width + _height * _height);
    var s_min_distance = min_distance; // second min distance
    var min_r;
    var s_min_r;
    var min_id;
    var s_min_id;
    drawarea_elt = dom.drawarea;
    var offset = Util.offset(drawarea_elt);
    for(i=0; i<circles.length; i++){
        var cx = parseFloat(circles[i].getAttribute('cx')) + offset.left;
        var cy = parseFloat(circles[i].getAttribute('cy')) + offset.top;
        var r = parseFloat(circles[i].getAttribute('r'));
        var x = parseFloat(sx)-cx;
        var y = parseFloat(sy)-cy;
        var distance = Math.sqrt(x*x + y*y);
        distance = distance - r; 
        if(distance <= s_min_distance && min_distance < distance){
            s_min_distance = distance;
            s_min_id = circles[i].getAttribute('id');
            s_min_r = r;
        }
        else if(distance <= min_distance){
            s_min_distance = min_distance;
            s_min_id = min_id;
            s_min_r = min_r;
            min_distance = distance;
            min_id = circles[i].getAttribute('id');
            min_r = r;
        }  
    }
    
    var ConD = min_distance + min_r;
    var IntD = s_min_distance;
    return [Math.min(ConD, IntD), min_id];
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
 
/*
Randomly generates the circles on the page
*/
function drawcircles(p, density, w, distractor){
    
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

    target = document.getElementById('0');
    target.style.setProperty('fill', 'var(--color-green)');
    // can color the target here if in the future need to color the target before.
    target_generated = 0;
    function tick(e) {
      circle
    //          .each(cluster(2 * e.alpha * e.alpha))
          .each(moveawayfromedge())
          .each(collide(.1))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
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

/*
Given the amplitude, cx and cy of target, specify the placement of the start button 
*/
function getstartpoint(A, cx, cy, offset){
    Math.seedrandom();
    var randomAngle = Math.PI * (2 * Math.random() - 1); 
    tarX = cx + A*Math.cos(randomAngle);
    tarY = cy + A*Math.sin(randomAngle);
    var window_height = document.documentElement.clientHeight;
    var window_width = document.documentElement.clientWidth;
    while(tarX < 0 || tarY < 0 || tarX > (window_width - 0.05*window_width) || tarY > (window_height - 0.05*window_height)){
        var randomAngle = Math.PI * (2 * Math.random() - 1); 
        tarX = cx + A*Math.cos(randomAngle);
        tarY = cy + A*Math.sin(randomAngle);
    }

	return [tarX, tarY];
}


/*
Checks if a point exists on the SVG box
*/
function existOnBoard(x, y, offset){
    if(x > offset.left & y > offset.top & x < offset.left + _width & y < offset.top + _height){
        return true;
    }
    else{
        return false;
    }
}

/*
starts all experiments
*/
function startAllExperiments(){
    if(_experiments == "few"){
        A=[512*_unit];
        w=[8*_unit, 16*_unit];
        eww=[3,4];
        D=[0.05,0.4];
        cursor=['normal', 'bubble'];
        dom.totalexp.innerHTML = "16";
    }
    else if(_experiments == "medium"){
        A=[256*_unit, 512*_unit];
        w=[8*_unit, 16*_unit];
        eww=[3, 4];
        D=[0.05, 0.4, 0.8];
        cursor=['normal', 'bubble'];
        dom.totalexp.innerHTML = "48";
    }
    else{
        A = [256*_unit, 512*_unit, 768*_unit];
        w = [8*_unit, 16*_unit, 32*_unit];
        eww = [3, 4, 5];
        D = [0.05, 0.4, 0.8];
        cursor=['normal', 'bubble'];
        dom.totalexp.innerHTML = "162";
    }
//    A=[256*_unit, 512*_unit], w = [8*_unit], eww=[3], D=[0.05, 0.8];
    _independent_vars = Combinatorics.cartesianProduct(A, w, eww, D, cursor);
    window.dispatchEvent(new CustomEvent("experiment0done"));
    vals = _independent_vars.next();
    if(vals!= null){
        startExperiment(vals[0], vals[1], vals[2], vals[3], vals[4], _experiment_num);
    }
}

/* convert a Json into a csv file */
function JSONToCSV(data, reportTitle) {
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

/*
Give this function individual data fields
 created using David Bau's gist at https://gist.github.com/davidbau/8c168b2720eacbf4e68e9e0a9f437838
 Bubble-Cursor submission function
 submits to the google form at this URL:
 docs.google.com/forms/d/e/1FAIpQLSfCpH0WlXUe9Ro1EAq8Quj1fhHTT1sbXF9CvdT8pYdjOKTWog/viewform
*/
function sendToFormBubbleCursor(datafields){
    for(i=0; i<datafields.length; i++){
    
        var formid = "e/1FAIpQLSfCpH0WlXUe9Ro1EAq8Quj1fhHTT1sbXF9CvdT8pYdjOKTWog";
        var data = {
            "entry.1471085130": datafields[i]['Name'],
            "entry.1873421313": datafields[i]['Age'],
            "entry.1530291618": datafields[i]['Gender'],
            "entry.2116772833": datafields[i]['Cursor'],
            "entry.1386335538": datafields[i]['A'],
            "entry.1897161171": datafields[i]['w'],
            "entry.1667270748": datafields[i]['eww'],
            "entry.1303636101": datafields[i]['Total-Density'],
            "entry.1952175203": datafields[i]['Distractors'],
            "entry.1819253252": datafields[i]['Time(ms)'],
            "entry.478510575": datafields[i]['NumClicks']
        };
        var params = [];
        for (key in data) {
            params.push(key + "=" + encodeURIComponent(data[key]));
        }
        // Submit the form using an image to avoid CORS warnings.
        (new Image).src = "https://docs.google.com/forms/d/" + formid +
         "/formResponse?" + params.join("&");
    }
}