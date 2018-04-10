# Bubble Cursor
Implementation of the paper [Bubble Cursor](http://www.dgp.toronto.edu/~tovi//papers/chi2005bubblecursor.pdf) for the 6.831 UI Implementation and Design class.

Youtube Link: 

Note: This implementation uses SVG and D3.js. 
In order to control the amplitude (A), I present a start button on every page, effective width (eww) is controlled via a padding property and every circle on the page has a different radius which is randomly generated (other than a fixed set of distractors). The radius of distractors and target is controlled via the 'w' variable. Time between clicks is recorded in milliseconds and number of clicks are captured before the correct target is selected.

The experiment is linked here
Instructions are explained to the user before starting and an indication of what the target will look like is shown to them when they hover over the circle in index.html
The tasks are sequenced and are balanced because even if the users choose to have few experiments, they still see a variety of independent variables
Informs the user about how long the experiment will take on the home page and has an ending message. Progress is also shown to them
Allows adjustment of experimental parameters via 'Few, Medium, All' bullet options in home page.
Records and outputs data
Collects demographic information as mentioned in the paper, but because the paper does not mention any subjective feedback they collected, it did not make sense to do so in this case.


External libraries/ Citations:
* [Bootstrap CSS stylesheet](https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css)
* [D3.JS V3](https://d3js.org/d3.v3.min.js)
* [Combinatorics.JS](https://github.com/dankogai/js-combinatorics)
* Util.JS: 6.813 Staff
* Crosshair.png: available on google photos