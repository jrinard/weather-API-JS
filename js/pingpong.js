function Calculator(skinName) { // function to pass in a skin for the calulator
  this.skin = skinName;
}

Calculator.prototype.pingPong = function(goal) { //ping pong being called on the calculator object
  var output = [];
  for (var i = 1; i <= goal; i++) {
    if (i % 15 === 0) {
      output.push("ping-pong");
    } else if (i % 3 === 0) {
      output.push("ping");
    } else if (i % 5 === 0) {
      output.push("pong");
    } else  {
      output.push(i);
    }
  }
  return output;
};

// all the functionality on this page is being packed into "Calculator" and then exported to "calculatorModule" for a global use.
exports.calculatorModule = Calculator; // exports provided by node to export things from one file and brings them into another.
// think of exports as a global object we are creating a new property called calulatorModule
