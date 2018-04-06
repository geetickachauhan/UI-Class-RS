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

// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {
        
//        	var xP = 0;
//	var yP = 0;
//	var rSize = 0;
//	var fillColor = '000000';	
//	var temp = '';
//	var svg = '';
//	for( var i = 0 ; i < 50 ; i++ ){
//			xP = Math.floor(Math.random() * (1000-100+1)+ 100);
//			yP = Math.floor(Math.random() * (500-100+1)+ 100);
//			rSize = Math.floor(Math.random() * (50-10+1)+ 10);
//			fillColor = Math.floor(Math.random()*16777215).toString(16);	
//			text = '<circle cx="' + xP + '" cy="' + yP + '" r="' + rSize + '" fill="#' + fillColor + '"/>';
//			temp = temp  +  text;				
//	}
//	var svg ='<svg id="svg" xmlns="http://www.w3.org/2000/svg"> ' + temp + '</svg>';
//	$(svg).appendTo( "#draw-area" );
//        
//    function intersectRect(r1, r2) {
//    var r1 = r1.getBoundingClientRect();    //BOUNDING BOX OF THE FIRST OBJECT
//    var r2 = r2.getBoundingClientRect();    //BOUNDING BOX OF THE SECOND OBJECT
// 
//    //CHECK IF THE TWO BOUNDING BOXES OVERLAP
//      return !(r2.left > r1.right || 
//               r2.right < r1.left || 
//               r2.top > r1.bottom ||
//               r2.bottom < r1.top);
//    }
//    
//    children = document.getElementById("svg").children;
//    for(i=0; i<children.length; i++){
//        
//    }
    distractor_density = {0.05: 1, 0.2: 5, 0.8: 10};
    density = 0.8; // we vary density from 0.05, 0.2, 0.8 which corresponds to distractor densities of 
        // 0, 0.5 and 1
	drawcircles(30, density, 10, distractor_density[density]);
    
    // basically above is effective width (EW), density (D) and target width (W)
    // then do amplitude by simply shifting the mouse in any direction at a particular distance from the target
        // there are 3 distractor targets which have the same size as the target
        // density varied between distracter density D (0, 0.5, 1)
        
        
//        amplitude A (256, 512, 768 units), width W (8, 16, 32 units), effective width to width ratio EW/W (1.33, 2, 3), and distracter density D (0, 0.5, 1). A fully crossed design resulted in 243 combinations of CT, A, W, and EW/W. Each participant performed the experiment in one session lasting approximately 90 minutes. The session was broken up by cursor type, with 4 blocks of trials completed for each cursor. In each block participants would complete trial sets for each of the 27 combinations of W, EW/W, and D presented in random order. A trial set consisted of selecting 9 targets in sequence (not counting the initial click on the start target).
        
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
        
        
//        // Element refs
//		dom.controlColumn = Util.one("#controls"); // example
//        dom.board = Util.one(".board");
//        dom.newgame = Util.one("#newgame");
//        dom.crushonce = Util.one("#btn-crushonce");
//        dom.textbox = Util.one("#textbox");
//        dom.left = Util.one("#btn-left");
//        dom.right = Util.one("#btn-right");
//        dom.up = Util.one("#btn-up");
//        dom.down = Util.one("#btn-down");
//        dom.showhint = Util.one("#showhint");
//        dom.pointstext = Util.one("#pointstext");
//        dom.points = Util.one("#btn-points");
//        dom.cellSize = getComputedStyle(dom.board).getPropertyValue('--cell');
//        
//        dom.board.style.setProperty('--size', size);
//        newgameutilities();
//
//		// Add events
//        dom.newgame.addEventListener("click", function(){ 
//            removehint();
//            removeAllChildren(dom.board);
//            newgameutilities();
//            dom.textbox.disabled = false;
//        });
//        // feedback from PS2: removed duplication below by calling functions
//        // further removal by creating event listener in a loop was not a successful
//        // attempt. This is the most that I was able to do.
//        dom.left.addEventListener("click", function(){
//            removehint();
//            unsetbackgroundforcell();
//            flipcandies("left");
//            controls_inputcheck(dom.left); 
//        });
//        
        
    },
        
 
    // Keyboard events arrive here
    "keydown": function(evt) {
      
    },
	// Click events arrive here
	"click": function(evt) {
		// Your code here
	}
});


function drawcircles(p, density, w, distractor){
    // density is defined as the number of circles. Make density a number between 4 and 100
    // W is dependent on max radius
    // A is amplitude which is distance to target. Just make the starting position of mouse such
    // that the distance from target is the amplitude
    
    
    // CT (Point, Bubble), amplitude A (192, 384, 768 units), width W (8, 16, 24 units), and effective width EW (32, 64, 96 units); let's divide the units by 2
    // effective width can be changed by padding because it is defined as a square
    
     // using https://bl.ocks.org/mbostock/1748247 as a basis
    
    var width = 900,
    height = 600,
    padding = p, // separation between same-color circles
    clusterPadding = 30, // separation between different-color circles
    maxRadius = 12;
    counter = 0; // provide ids to all circles
    
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
        .size([width, height])
        .gravity(0)
        .charge(5)
        .on("tick", tick)
        .start();

    var svg = d3.select("#draw-area").append("svg");
    
    var circle = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", function(d) { return d.radius; })
        .attr("id", function(d){ return counter++;})
        .style("fill", "var(--color-light-gray)");
//        .call(force.drag);
    target_generated = 0;
    console.log(target_generated);
    function tick(e) {
      circle
          .each(cluster(5 * e.alpha * e.alpha))
          .each(collide(.5))
//        .each(moveawayfromedge())
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      return function(d) {
        var cluster = clusters[d.cluster],
            k = 1;

        // For cluster nodes, apply custom gravity.
        if (cluster === d) {
          cluster = {x: width / 2, y: height / 2, radius: -d.radius};
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

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + maxRadius + padding,
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
