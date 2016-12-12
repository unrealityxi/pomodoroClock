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
  var speed = 1000;

  var breakSound = new Audio('media/chime.mp3');
  var sessionSound = new Audio("media/gong.mp3");
  var blue = "rgba(22, 22, 255, 0.7)"
  var red = "rgba(138, 0, 39, 1)"

function pause(){
  if (!paused){
    clearTimeout(timer);
    paused = true;
    isRunning = false;
    $("#indicator > i").removeClass("fa-spin");
  }
  else {
    $("#indicator > i").addClass("fa-spin");
    paused = false;
    isRunning = true;
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
          $("#wrapper, #filling").css({"background-color": blue}); 
          sessionDuration = stringToSec($("#sessionLength").text());
          sessionLength = sessionDuration;
          sessionSound.play();
          firstRun = false;
        }

        if (sessionDuration <= 0){
            breakDuration = stringToSec($("#breakLength").text());
            breakLength = breakDuration;
            $("#wrapper, #filling").css({"background-color": red});
            fillScreen(100);
            breakSound.play();
            return startBreak();
        }
        session = true;
        
        sessionDuration--;

        fillScreen(getInversePercent(sessionDuration, sessionLength));


        output("#session", secToString(sessionDuration));
        timer = setTimeout(startSession, speed);
    }

function startBreak(){
        if (breakDuration <= 0){
            sessionDuration = stringToSec($("#sessionLength").text());
            sessionLength = sessionDuration;
            $("#wrapper, #filling").css({"background-color": blue}); 
            fillScreen(100);
            sessionSound.play();
            return startSession();
        }
        session = false; 
        
        breakDuration--;

        fillScreen(getInversePercent(breakDuration, breakLength));
        output("#session", secToString(breakDuration));
        timer = setTimeout(startBreak, speed);
    }

  // Attach click handlers
  $(".breakCtrl > .increment").click({target:"#breakLength"}, increment);
  $(".breakCtrl > .decrement").click({target:"#breakLength"}, decrement);

  $(".breakCtrl > .decrement, .breakCtrl > .increment").click(function(){

    if (paused && !session) {
      fillScreen(100);

      output("#session", secToString(stringToSec(readInput("#breakLength"))));
      breakDuration = stringToSec(readInput("#breakLength"));
      breakLength = breakDuration;

    }
    


  });


  $(".sessCtrl > .increment").click({target:"#sessionLength"}, increment);
  $(".sessCtrl > .decrement").click({target:"#sessionLength"}, decrement);
  $(".sessCtrl").click(function(){
    if (isRunning){
        return;
    }
    output("#session", secToString(stringToSec(readInput("#sessionLength"))));
    sessionDuration = stringToSec(readInput("#sessionLength"));
    firstRun = true;
    session = true;
    $("#wrapper, #filling").css("background-color", blue); 
    fillScreen(100);
  });
  $("#session, #indicator").click(pause);

  
  
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
    $("#filling").css({top: percent + "vh", transition: "1s"});
  }

  function getInversePercent(a, b){
    return a/b * 100;
  }

  
})();