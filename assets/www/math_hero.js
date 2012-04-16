$(document).ready(function(){
  var timer;
  var timer_is_on = true;

  var getRandomNumber = function(){
    return Math.round(Math.random(10) * 10);
  };

  var getRandomOperator = function(){
    var val = getRandomNumber();
    switch(true){
      case (val < 4):
        return "+";
        break;
      case (val >= 4 && val < 6):
        return "*";
        break;
      case (val >= 6 && val < 8):
        return "/";
        break;
      default:
        return "-";
        break;
    }
  };

  var movedown = function(){
    $("#calc_box").css('top', (parseInt($("#calc_box").css('top'), 10) + 5));
  };

  var startTimer = function(){
    movedown();
    if(timer_is_on){
      timer = setTimeout(startTimer, 100);
    }
  };

  var populate_sum = function(){
    $("#right_term").html(getRandomNumber());
    $("#operation").html(getRandomOperator());
    $("#left_term").html(getRandomNumber());
  };

  var startGame = function(){
    timer_is_on = true;
    $("#pause_button").find(".ui-btn-text").html("Pause");
    startTimer();
  }

  $("#start_button").click(function(){
    populate_sum();
    clearTimeout(timer);
    $("#calc_box").css('top', 0);
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