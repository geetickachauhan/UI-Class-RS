//var _name, _gender, _age, _cursor;
// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {
        dom.name = Util.one('#name');
        dom.age = Util.one('#age');
        dom.name.focus();
        dom.name.addEventListener('input', function(){
            dom.name.style.setProperty('background-color', 'var(--color-light-gray)');
            input = dom.name.value;
            var name_regex = new RegExp('^[a-zA-Z]+$');
            if(!!name_regex.test(input) == false){
                if(input.length > 0){
                    dom.name.style.setProperty('background-color', 'var(--color-light-red)');
                }
            } 
            
        });
        dom.age.addEventListener('input', function(){
            dom.age.style.setProperty('background-color', 'var(--color-light-gray)');
            input = dom.age.value;
            var num_regex = new RegExp('^[1-9][0-9]{0,1}$');
            if(!!num_regex.test(input) == false){
                if(input.length > 0){
                dom.age.style.setProperty('background-color', 'var(--color-light-red)');
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


function getRadioVal(name){
    radios = document.getElementsByName(name);
    for (var i = 0; i < radios.length; i++)
    {
        if (radios[i].checked)
        {
            return(radios[i].value);
        }
    }
}

var Go = function(){
    name = dom.name.value;
    gender = getRadioVal('gender');
    age = dom.age.value;
    cursor = getRadioVal('cursor');
    var name_regex = new RegExp('^[a-zA-Z]+$');
    var num_regex = new RegExp('^[1-9][0-9]{0,1}$');
    var error = "You have the following errors:";
    var check = false;
    if(!!name_regex.test(name) == false){
        error = error.concat('\nName must have only alphabets with no spaces');
        check = true;
    } 
    if(!!num_regex.test(age) == false){
        error = error.concat('\nAge must be from 1-99 with no spaces');
        check = true;
    }
    if(check == true){
        window.alert(error);
        return;
    }
    // now we must link to the next page
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('age', age);
    sessionStorage.setItem('gender', gender);
    sessionStorage.setItem('cursor', cursor);
    window.location.href = "experiment.html";
}