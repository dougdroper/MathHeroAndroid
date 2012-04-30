if(typeof MHERO === "undefined") {
  var MHERO = {};
};

MHERO.time_control = function() {
  var timer_is_on = false,
      box_timeout,
      clock_timeout;

  var clock = {
    game_length: 10
  };

  var moveBoxDown = function() {
    var calc_box = $("#calc_box");
    var calc_box_top = parseInt(calc_box.css("top"), 10);
    var dead_line = $("#dead_line").offset().top;

    if(calc_box_top + 58 <= dead_line){
      calc_box.css('top', calc_box_top + 5);
    } else {
      reachedDeadLine();
    }
    box_timeout = setTimeout(moveBoxDown, 100);
  };

  var reachedDeadLine = function() {
    timer_is_on = false;
    $("#pause_button").hide();
    $(".answers").hide();
  };

  var updateClock = function(time) {
    $("#clock").html(time);
  };

  var clearTimeouts = function() {
    clearTimeout(box_timeout);
    clearTimeout(clock_timeout);
  };

  var countDown = function() {
    updateClock(clock.game_length);
    clock.game_length = clock.game_length - 1;

    if(clock.game_length < 0) {
      timer_is_on = false;
      endGame();
    }

    clock_timeout = setTimeout(countDown, 1000);  
  };

  return {
    resetTimer: function() {
      clearTimeouts();
      timer_is_on = false;
    },
    
    startClock: function() {
      countDown();
    },

    moveDown: function() {
      if(!timer_is_on) {
        timer_is_on = true;
        moveBoxDown();
      }
    }
  };
};