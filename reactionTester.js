/* Program prompts user with text to test reaction times 
* Written by Daniel Steinberg, 10/10/19
* Requires keypress and blessed libraries to be installed:
* Run "$npm install keypress blessed" in the command line
*/

var blessed = require('blessed')
  , keypress = require('keypress');

var screen = blessed.screen();

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();


/* Keypress set up */

keypress(process.stdin);
if (typeof process.stdin.setRawMode == 'function') {
  process.stdin.setRawMode(true);
} else {
  tty.setRawMode(true);
}


/* Trial simulation */

const numTrials = 30;
var i = 0;
const minTime = 1000;
const maxTime = 4000;
var waitingForSpace = false;
var reactionTimes = [];

process.stdin.on('keypress', function (ch, key) {
  if (key && key.name == 'space' && waitingForSpace) {
  	screen.render();
  	noteReaction();
  }
});

setTimeout(promptUser, Math.random() * (maxTime - minTime) + minTime); //Wait 1 to 4 seconds

function promptUser() {
	var d = new Date();
	var stamp1 = d.getTime();
	reactionTimes[i] = stamp1;
	waitingForSpace = true;
	console.log("New prompt (press space)");
}

function noteReaction() {
	console.log("Reaction noted");
  	waitingForSpace = false;
  	var d = new Date();
	var stamp2 = d.getTime();
	reactionTimes[i] = stamp2 - reactionTimes[i];
	console.log(reactionTimes[i] + " i = " + i);
	if (i < numTrials - 1) {
		i++;
		setTimeout(promptUser, Math.random() * (maxTime - minTime) + minTime);
	} else {
		console.log("Tests complete");
		writeToCSV(reactionTimes);
	}
}


/* Write results to file */

const fs = require('fs');

function writeToCSV(resultsArray){
  var csv = resultsArray.join(", ");
  console.log(csv);
  fs.writeFile("reactions.csv", csv, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("Results were saved to reactions.csv");
  }); 
}
