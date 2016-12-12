(function(){ 
  "use strict"
  var timer;
  var paused = true;
  var isRunning = false;
  var breakDuration = stringToSec(readInput("#breakLength"));
  var breakLength = breakDuration;
  var sessionDuration = stringToSec(readInput("#sessionLength"));
  var sessionLength = sessionDuration;
  var session = true;
  var firstRun = true;

function pause(){
  if (!paused){
    clearTimeout(timer);
    paused = true;
    isRunning = false;
    $("#indicator > i").removeClass("fa-spin");
  }
  else {
    paused = false;
    isRunning = true;
    $("#indicator > i").addClass("fa-spin");
    if (session){
      startSession();
    }
    else {
      startBreak();
    }
    
  }
}

function startSession(){

        if (firstRun){
          sessionDuration = stringToSec($("#sessionLength").text());
          sessionLength = sessionDuration;
          firstRun = false;
        }

        if (sessionDuration <= 0){
            breakDuration = stringToSec($("#breakLength").text());
            breakLength = breakDuration;
            fillScreen(100);
            return startBreak();
        }
        session = true;
        $("#wrapper, #filling").css("background-color", "#2222ff"); 
        sessionDuration--;

        fillScreen(getInversePercent(sessionDuration, sessionLength));


        output("#session", secToString(sessionDuration));
        timer = setTimeout(startSession, 10);
    }

function startBreak(){
        if (breakDuration <= 0){
            sessionDuration = stringToSec($("#sessionLength").text());
            sessionLength = sessionDuration;
            fillScreen(100);
            return startSession();
        }
        session = false; 
        $("#wrapper, #filling").css("background-color", "#8a0027"); 
        breakDuration--;

        fillScreen(getInversePercent(breakDuration, breakLength));
        output("#session", secToString(breakDuration));
        timer = setTimeout(startBreak, 10);
    }

  // Attach click handlers
  $(".breakCtrl > .increment").click({target:"#breakLength"}, increment);
  $(".breakCtrl > .decrement").click({target:"#breakLength"}, decrement);

  $(".sessCtrl > .increment").click({target:"#sessionLength"}, increment);
  $(".sessCtrl > .decrement").click({target:"#sessionLength"}, decrement);
  $(".sessCtrl").click(function(){
    if (isRunning){
        return;
    }


    output("#session", secToString(stringToSec(readInput("#sessionLength"))));
    sessionDuration = stringToSec(readInput("#sessionLength"));
    firstRun = true;
    $("#wrapper, #filling").css("background-color", "#2222ff"); 
    fillScreen(100);
  });
  $("#session").click(pause);

  
  
  /***************************/
  /**********Helpers**********/
  /***************************/
  
  
  // Increments value contained within target
  function increment(event){
    if (isRunning){
        return;
    }
    var target = event.data.target;
    // Get the value of the target
    var value = parseInt(readInput(target));
    // Increment it
    value++;
    // Output incremented value back to target
    output(target, value);
  }
  
  // Decrements value contained within target
  function decrement(event){
    if (isRunning){
        return;
    }

    var target = event.data.target || event;
    // Get the value of the target
    var value = parseInt(readInput(target));
    if (value <= 1){
      return;
    }
    // Decrement it
    value--;
    // Output incremented value back to target
    output(target, value);
  }
  
  // Reads contents of a target
  function readInput(target){
    return $(target).text();
  }
  
  // Outputs content to a target
  function output(target, value){
    $(target).text(value);
  }
  
  // Converts formated time to seconds
  function stringToSec(string){
    string = string.split(":");
    if (string.length < 2 ){
        return string[0] * 60;
    }
    return parseInt(string[0]) * 60 + parseInt(string[1]);
  }
  
  // Converts seconds to displayable time
  function secToString(seconds){
    var minutes = zeroPad(Math.floor(seconds / 60));
    var seconds = zeroPad(seconds % 60);

    return `${minutes}:${seconds}`;

  }

  function zeroPad(number, width) {

    width = width || 2;

    var string = String(number);
    while (string.length < width){
        string = "0" + string;
    }
    return string;
  }

  function fillScreen(percent){
    $("#filling").css("top", percent + "vh");
  }

  function getInversePercent(a, b){
    return Math.floor(a/b * 100);
  }

  
})();