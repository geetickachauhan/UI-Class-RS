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

// constants
const DEFAULT_BOARD_SIZE = 8;
// set size from URL or to default
const size = Math.min(10, Math.max(3, +Util.getURLParam("size") || DEFAULT_BOARD_SIZE));

// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// data model at global scope for easier debugging
// initialize board model
var board = new Board(size);

// load a rule
var rules = new Rules(board);

// the current cell entered in the textbox
var yellow = null;

// mapping colors to the source
var color_dict = {
    "blue": 'graphics/blue-candy.png',
    "red": 'graphics/red-candy.png',
    "yellow": 'graphics/yellow-candy.png',
    "green": 'graphics/green-candy.png',
    "orange": 'graphics/orange-candy.png',
    "purple": 'graphics/purple-candy.png'
}
// dictionary for mapping numbers to row/ column letters/ numbers
var dict = {
            0: "",
            1: "a",
            2: "b",
            3: "c",
            4: "d",
            5: "e",
            6: "f",
            7: "g",
            8: "h", 
            9: "i", 
            10: "j"}; 
var other_dict = {}; // swapped dict of above
for(var key in dict){
    other_dict[dict[key]] = key;
}

// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {
        // Element refs
		dom.controlColumn = Util.one("#controls"); // example
        dom.board = Util.one(".board");
        dom.newgame = Util.one("#newgame");
        dom.crushonce = Util.one("#btn-crushonce");
        dom.textbox = Util.one("#textbox");
        dom.left = Util.one("#btn-left");
        dom.right = Util.one("#btn-right");
        dom.up = Util.one("#btn-up");
        dom.down = Util.one("#btn-down");
        dom.showhint = Util.one("#showhint");
        dom.pointstext = Util.one("#pointstext");
        dom.points = Util.one("#btn-points");
        dom.cellSize = getComputedStyle(dom.board).getPropertyValue('--cell');
        
        dom.board.style.setProperty('--size', size);
        newgameutilities();

		// Add events
        dom.newgame.addEventListener("click", function(){ 
            removehint();
            removeAllChildren(dom.board);
            newgameutilities();
            dom.textbox.disabled = false;
        });
        // feedback from PS2: removed duplication below by calling functions
        // further removal by creating event listener in a loop was not a successful
        // attempt. This is the most that I was able to do.
        dom.left.addEventListener("click", function(){
            removehint();
            unsetbackgroundforcell();
            flipcandies("left");
            controls_inputcheck(dom.left); 
        });
        
        dom.right.addEventListener("click", function(){
            removehint();
            unsetbackgroundforcell();
            flipcandies("right");
            controls_inputcheck(dom.right);
        });
        dom.up.addEventListener("click", function(){
            removehint();
            unsetbackgroundforcell();
            flipcandies("up");
            controls_inputcheck(dom.up); 
        });
        dom.down.addEventListener("click", function(){
            removehint();
            unsetbackgroundforcell();
            flipcandies("down");
            controls_inputcheck(dom.down);
        });
        dom.showhint.addEventListener("click", function(){
            removehint();
            getmove = rules.getRandomValidMove();
            fromcandy = getmove.candy;
            direction = getmove.direction;
            candiestocrush = rules.getCandiesToCrushGivenMove(fromcandy, direction);
            promise = Util.delay(0);
            promise.then(function(){
               setpulsation(candiestocrush); 
            });
            dom.textbox.focus();
        });
        dom.crushonce.addEventListener("click", function(){
            var setofsetofcandies = rules.getCandyCrushes();
            unsetbackgroundforcell();
            if(setofsetofcandies.length < 1){
                console.log("Crush once button should not have been pressed");
                return;
            }
            var candies_to_delete = rules.removeCrushes(setofsetofcandies);
            disablebuttons([dom.right, dom.up, dom.down, dom.left, dom.crushonce, dom.textbox, dom.showhint]);
            promise = Util.delay(250); 
            promise.then(function(){reappear();}); 
        });
        dom.textbox.addEventListener("input", function(){ 
            // check over here if the stuff entered into the keyboard is correct and if not, disable the stuff
            dom.textbox.style.setProperty('background-color', 'var(--color-white)');
            disablebuttons([dom.right, dom.up, dom.down, dom.left]);
            unsetbackgroundforcell();
            var input = dom.textbox.value;
            if(size <= 9 & size >= 3){
                letterend = dict[size];
                numend = size.toString();
                var regex = new RegExp('^[a-'+letterend+']{1}[1-'+numend+']{1}$');
            }
            else if(size == 10){
                var regex = new RegExp('^[a-j]{1}((1{1}0{1})|([0-9]{1}))$');
            }
            else{
                console.log("incorrect size of board");
                return;    
            }
            if(!!regex.test(input) == false){ 
                console.log(input + " Form was not valid");
                if(input.length > 2){
                    dom.textbox.style.setProperty('background-color', 'var(--color-light-red)');
                }
                return;
            }
            console.log(input + " got through and now disabling needed buttons");
            // before doing any of this must check if candies can be crushed
            candycrushes = rules.getCandyCrushes().length;
            console.log("input textbox");
            checkcandiestocrushexist(candycrushes, [dom.right, dom.up, dom.down, dom.left, dom.textbox, dom.showhint]);
            if(candycrushes > 0){return;}
            checkcandiestocrushnotexist(candycrushes);
            var fromcol = other_dict[input[0]] - 1;
            var fromrow = input[1] - 1;
            var fromcandy = board.getCandyAt(fromrow, fromcol);
            console.log(fromcandy + " this is the from candy");
            
            // input is in the form col - row; first get it as row-col then make it a-h: 0 to 8
            // get candy at that method
            direction = ["up", "down", "left", "right"];
            setbackgroundforcell(fromcol, fromrow);
            button = [dom.up, dom.down, dom.left, dom.right];
            for(i=0; i<direction.length; i++){
                if(rules.isMoveTypeValid(fromcandy, direction[i])){ 
                    console.log("move valid in direction " + direction[i]);
                    button[i].disabled = false;
                }
                else{
                    button[i].disabled = true;
                }
            }
        });
    },
        
 
    // Keyboard events arrive here
    "keydown": function(evt) {
      
    },
	// Click events arrive here
	"click": function(evt) {
		// Your code here
	}
});

/* 
Utility function to get all cells created in the board. 
Created for future use. 
*/
function getallcells(){
    cells = [];
    for(i=1; i<=size; i++){
        for(j=1; j<=size; j++){
            var id = (i-1) + "" + (j-1); 
            elt = document.getElementById(id);
            cells.push(elt);
        }
    } 
    return cells;
}
/*
Utility function for setting the background yellow for current cell
*/
function setbackgroundforcell(fromcol, fromrow){
    elt = document.getElementById(fromrow + "" +fromcol);
    elt.style.setProperty('background-color', "var(--color-yellow)");
    yellow = elt;
}
/* 
Unsetting the yellow from current cell back to silver
*/
function unsetbackgroundforcell(){
    if(yellow != null){
        yellow.style.setProperty('background-color', "var(--color-silver)");
    }
}

/*
Things to do when new game is loaded by pressing the new game button
or restarting the DOM
*/
function newgameutilities(){
    createGameGrid();
    unsetbackgroundforcell();
    rules.prepareNewGame();
    disablebuttons([dom.right, dom.left, dom.up, dom.down, dom.crushonce, dom.showhint]);
    candycrushes = rules.getCandyCrushes().length; 
    console.log("Candy crushes=", candycrushes);
    checkcandiestocrushnotexist(candycrushes);
    // might have to check over here if valid crushes exist/ show hint should be shown. 
    dom.textbox.value = "";
    dom.textbox.focus();
}

/*
Tasks to perform when there are candies to crush
*/
function checkcandiestocrushexist(candycrushes, buttonstodisable){
    if(candycrushes > 0){ // it's time to enable the necessary things
        console.log("Candies to be crushed", rules.getCandyCrushes());
        dom.crushonce.disabled = false;
        disablebuttons(buttonstodisable);
    }
}
/*
Tasks to perform when there are no more candies to crush
*/
function checkcandiestocrushnotexist(candycrushes){
    if(candycrushes == 0){
        console.log("Candies not to be crushed", rules.getCandyCrushes());
        dom.crushonce.disabled = true;
        dom.textbox.disabled = false; // must enable the textbox
        // must check over here if get random valid move returns something 
        getmove = rules.getRandomValidMove();
        console.log("Get move", getmove);
        if(getmove){
            dom.showhint.disabled = false;
        }
    }
}
/*
Utility function to remove the pulsation from all the board's candies
*/
function removehint(){
    allcandies = board.getAllCandies();
    unsetpulsation(allcandies);
}
/*
Utility function to set the pulsation animation
*/
function setpulsation(candies){
    for(i=0; i<candies.length; i++){
        candy = candies[i];
        elt = Util.one("#candy"+candy.id);
        elt.style.setProperty('animation', "pulsate var(--duration-pulsate) ease-in-out calc(var(--duration-pulsate)/4) infinite");
    }
}
/*
Utility function to unset the pulsation animation
*/
function unsetpulsation(candies){
    for(i=0; i<candies.length; i++){
        candy = candies[i];
        elt = Util.one("#candy"+candy.id);
        if(elt != null){
        elt.style.setProperty('animation', "none");}
    }
}
/*
Utility function called by crush once button listener once 
the crushes have been removed and new candie need to be added to the board
*/
function reappear(){
    rules.moveCandiesDown(); // there should be a wait between here and the enabling of buttons
    allcandies = board.getAllCandies();
    console.log("reappear");
    candycrushes = rules.getCandyCrushes().length;
    checkcandiestocrushexist(candycrushes, [dom.right, dom.up, dom.down, dom.left, dom.textbox, dom.showhint]);
    checkcandiestocrushnotexist(candycrushes);
    if(candycrushes == 0){
        dom.textbox.focus();
    }
}
/*
Utility function called by arrow buttons
*/
function controls_inputcheck(button){
    all_buttons = [dom.left, dom.right, dom.up, dom.down, dom.textbox, dom.showhint];
    disable_buttons = all_buttons.filter(e => e !== button);
    dom.textbox.value = "";
    dom.textbox.focus();
    button.disabled = true;
    candycrushes = rules.getCandyCrushes().length;
    console.log("controls_inputcheck");
    disablebuttons(disable_buttons);
    checkcandiestocrushexist(candycrushes, disable_buttons);
}
/*
Enable a set of buttons
*/
function enablebuttons(buttons){
    for(i=0; i<buttons.length; i++){
        buttons[i].disabled = false;
    }
}
/*
Disable a set of buttons
*/
function disablebuttons(buttons){
    for(i=0; i<buttons.length; i++){
        buttons[i].disabled = true;
    }
}

/*
Flips the candies
*/
function flipcandies(button_clicked){
    console.log("flip candies");
    var input = dom.textbox.value;
    var fromcol = other_dict[input[0]] - 1;
    var fromrow = input[1] - 1;
    var fromcandy = board.getCandyAt(fromrow, fromcol);
    var tocol, torow;
    // input is in the form col - row; first get it as row-col then make it a-h: 0 to 8
    // get candy at that method
    if(rules.isMoveTypeValid(fromcandy, button_clicked)){
        // check if valid move; pass in the candy and the up, down etc 
        tocandy = board.getCandyInDirection(fromcandy, button_clicked);
        tocandyrowid = tocandy.row + "" + tocandy.col;
        board.flipCandies(fromcandy, tocandy);
    }
}
/*
Remove all children of an element
*/
function removeAllChildren(elt) {
    console.log("remove all children for", elt);
    if(elt == null){
        console.log("element was null, no children removed");
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
generates the game grid for the view
*/
function createGameGrid(){
    console.log("create game grid");
        for(i=0; i<=size; i++){
            var col="";
            for(j=0; j<=size; j++){
                if(i==0){
                    col += "<div class='blank-cell'>" + dict[j] + "</div>";
                }
                else{
                    if(j==0){
                        col += "<div class='blank-cell'>" + i + "</div>";
                    }
                    else{
                        var num = (i-1) + "" + (j-1); 
                        col += "<div class='cell' id='" + num + "'></div>";
                    }
                }
            }
            $("div#grid.board").append(col);
        }
}
/* 
Given the rows and columns, calculate the direction of move and distance
*/
function getdirectiondistance(fromrow, fromcol, torow, tocol){
    if(fromcol > tocol){
        val = fromcol - tocol;
        return ["left", val];
    }
    if(fromcol < tocol){
        val = tocol - fromcol;
        return ["right", val];
    }
    if(fromrow > torow){
        val = fromrow - torow;
        return ["up", val];
    }
    if(fromrow < torow){
        val = torow - fromrow;
        return ["down", val];
    }
    return ["none", 0];
}
/* 
Utility function to get translation variables for move operation in 
board
*/
function getslidevariables(direction){
    if(direction == "up"){
        return ["0%", "200%", "0%", "0%"];
    }
    if(direction == "down"){
        return ["0%", "-200%", "0%", "0%"];
    }
    if(direction == "right"){
        return ["-200%", "0%", "0%", "0%"];
    }
    if(direction == "left"){
        return ["200%", "0%", "0%", "0%"];
    }
    return null;
}
/*
Utility function for move to multiply distance with the translation value
*/
function distancecalibrationslide(distance, slidevars){
    var newslidevars = []
    for(i=0; i< slidevars.length; i++){
        if(slidevars[i] != "0%"){
            var str = "calc(" + slidevars[i] + "*" + distance + ")";
            newslidevars[i] = str;
        }
        else{
            newslidevars[i] = slidevars[i];
        }
    }
    return newslidevars;
}
// Attaching events to the board; pure view
Util.events(board, {
	// add a candy to the board
	"add": function(e) {
        console.log("add called");
        elt = document.getElementById(e.detail.candy.row + "" + e.detail.candy.col);
        if(e.detail.fromRow == null || e.detail.fromCol == null){
            console.log("fromRow or fromCol was null");
            var img = "<img class='image' id='candy"+e.detail.candy.id+"'" + "src='"+color_dict[e.detail.candy.color]+"'>";
            if(elt != null){
                if(elt.hasChildNodes()){removeAllChildren(elt);}
            }
            $("#" + e.detail.candy.row + "" + e.detail.candy.col).append(img);
        }
        else{ // candies are coming from the top and fromRow is negative val
            console.log("fromRow or fromCol was negative");  
            distance = Math.abs(e.detail.fromRow - e.detail.candy.row);
            if(elt.hasChildNodes()){ removeAllChildren(elt);}
            var img = "<img class='image' id='candy"+e.detail.candy.id+"'" + "src='"+color_dict[e.detail.candy.color]+"' style='--distance: "+distance+"; animation: dropfromhigh calc(var(--duration-move) *"+distance+") ease-out calc(var(--duration-move)*"+distance+"/4) 1;'>";
            promise = Util.afterAnimation(elt, "dropfromhigh");
            promise.then(function(){
                // keep below due to synchronizing issues
                elt = document.getElementById(e.detail.candy.row + "" +e.detail.candy.col);
                if(elt != null){
                    if(elt.hasChildNodes()){removeAllChildren(elt);}
                }
                $("#" + e.detail.candy.row + "" + e.detail.candy.col).append(img);
            });   
        } 
	},

	// move a candy from location 1 to location 2
	"move": function(e) { // now this one needs to be fixed; add is already working; figure out where to do remove all children
        console.log("move called");
        directionanddistance = getdirectiondistance(e.detail.fromRow, e.detail.fromCol, e.detail.toRow, e.detail.toCol);
        direction = directionanddistance[0];
        distance = directionanddistance[1];
        var img;
        if(direction == "none"){
            console.log("something weird happened, and there is no direction");
            img = "<img class='image' id='candy"+e.detail.candy.id+"'" + "src='"+color_dict[e.detail.candy.color]+"'>"
        }
        else{
            vars = getslidevariables(direction);
            if(vars != null){
                vars = distancecalibrationslide(distance, vars);
                img = "<img class='image' id='candy"+e.detail.candy.id+"'" + "src='"+color_dict[e.detail.candy.color]+"' style='--fromhor: "+vars[0]+"; --fromvert: "+vars[1]+"; --tohor: "+vars[2]+"; --tovert: "+vars[3]+"; animation: slide calc(var(--duration-move)*"+distance+") ease-in calc(var(--duration-move)*"+distance+"/4) 1;'>";
            }
        }
        // line below is necessary; do not touch
        tocell = document.getElementById(e.detail.toRow + "" + e.detail.toCol);
        if(tocell.hasChildNodes()){
            removeAllChildren(tocell);
        }
        promise = Util.afterAnimation(tocell, "slide");
        promise.then(function(){
            // keep below due to synchronizing issues
            elt = document.getElementById("candy" + e.detail.candy.id);
            if(elt != null){elt.parentNode.removeChild(elt);}
            candycrushes = rules.getCandyCrushes().length;
            $("#" + e.detail.toRow + e.detail.toCol).append(img);
        });
	},

	// remove a candy from the board
	"remove": function(e) {
        console.log("remove called");
        elt = document.getElementById("candy"+e.detail.candy.id);
        if(elt != null){
            elt.style.setProperty('animation', "fadeout var(--duration-fade) ease-in-out calc(var(--duration-fade)/4) 1");
            promise = Util.afterAnimation(elt, "fadeout");
            promise.then(function(){
                if(elt != null && elt.parentNode != null){
                    elt.parentNode.removeChild(elt);}
            });
        }
	},

	// update the score; can also make this a smooth animation
	"scoreUpdate": function(e) {
        console.log("scoreupdate called");
        buttonpoints = dom.points;
        if(e.detail.score != 0){
            tocolor = e.detail.candy.color;
            tobordercolor = e.detail.candy.color;
            tofontcolor = (tocolor == "yellow"? "gray": "white");
        }
        else{
            tocolor = "silver";
            tobordercolor = "light-gray";
            tofontcolor = "white"; 
        }
        buttonpoints.style.setProperty('background-color', "var(--color-"+tocolor+")");
        buttonpoints.style.setProperty('border', "1px solid var(--color-"+tobordercolor+")");
        buttonpoints.style.setProperty('color', "var(--color-"+tofontcolor+")");

        removeAllChildren(dom.pointstext);
        dom.pointstext.append(e.detail.score);
	},
});
