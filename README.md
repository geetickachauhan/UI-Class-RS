# Bubble Cursor
Implementation of the paper [Bubble Cursor](http://www.dgp.toronto.edu/~tovi//papers/chi2005bubblecursor.pdf) for the 6.831 UI Implementation and Design class.

Collaborator: Maroula Bach (informed me about Combinatorics library)

[Screencast Link](https://youtu.be/j6sqSDGked4)

The experiment is linked [here](http://people.csail.mit.edu/geeticka/UI-Class-RS)

My sequence of tasks is: First the user fills out a form for their demographic information and selects which cursor they want to test first. I recommend them to reload the index page to test the other cursor as well. My reason for breaking the control condition from the test condition was that the user may want to take a small break between the tasks and I didn't want fatigue to influence the truth of my results. Each trial run collects the values of the independent variables listed in the next paragraph along with their demographic information i.e Name, Age, Gender as is collected by the authors of the paper. They did not collect any subjective information, and therefore I am not either. The only question to ask would be "did you like the bubble cursor?" and that doesn't give a lot of insight into the cursor's effectiveness. The data is stored during the experiment in JSON format and is then sent to a google form to store in a google spreadsheet online. 

 
Note: This implementation uses SVG and D3.js. 
The experimental parameters in my implementation are: Cursor Type (CT), Amplitude (A), effective width (eww), width(w), Distractor Density(D), Time (in ms) and Number of Clicks before target selected. 

The user can also select whether they want to apply few tests, medium number of tests and all tests to allow them control over the number of tests they perform. Offering these as radio buttons makes it simple for them to select the option even if they may not fully understand it in the beginning. In order to control the amplitude (A), I present a start button on every page, effective width (eww) is controlled via a padding property and every circle on the page has a different radius which is randomly generated (other than a fixed set of distractors). The radius of distractors and target is controlled via the 'w' variable. Time between clicks is recorded in milliseconds and number of clicks are captured before the correct target is selected.

* Instructions are explained to the user before starting and an indication of what the target will look like is shown to them when they hover over the circle on the homepage. 
* The tasks are sequenced and are balanced because even if the users choose to have few experiments, they still see a variety of independent variables. 
* The experiment informs the user about how long the experiment will take on the home page and has an ending message. Progress is also shown to them
* Allows adjustment of experimental parameters via 'Few, Medium, All' bullet options in home page.
* Records and outputs data
* Collects demographic information as mentioned in the paper, but because the paper does not mention any subjective feedback they collected, it did not make sense to do so in this case.


External libraries/ Citations:
* [Bootstrap CSS stylesheet](https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css)
* [D3.JS V3](https://d3js.org/d3.v3.min.js)
* [Combinatorics.JS](https://github.com/dankogai/js-combinatorics)
* Util.JS: 6.813 Staff
* Crosshair.png: available on google photos