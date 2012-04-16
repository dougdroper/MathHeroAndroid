$(document).ready(function(){
  var timer;
  var timer_is_on = true;

  var movedown = function(){
    $("#calc_box").css('top', (parseInt($("#calc_box").css('top'), 10) + 5));
  };

  var startTimer = function(){
    movedown();
    if(timer_is_on){
      timer = setTimeout(startTimer, 100);
    }
  };

  var startGame = function(){
    timer_is_on = true;
    $("#pause_button").find(".ui-btn-text").html("Pause");
    startTimer();
  }

  $("#start_button").click(function(){
    startGame();
  });

  $("#pause_button").click(function(){
    var btn = $("#pause_button").find(".ui-btn-text");
    if(btn.html() === "Pause"){
      timer_is_on = false;
      clearTimeout(timer);
      btn.html("Continue");
    } else {
      startGame();
    }
  });

});