$(document).ready(function(){
  var timer;
  var timer_is_on = true;

  var GameRandomGenerator = {
    randomNumber: function(){
      return Math.round(Math.random(10) * 10);
    },
    randomOperator: function(){
      var val = this.getRandomNumber();
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
    }
  };

  function Question(options){
    this.left = options["left"];
    this.operation = options["operation"];
    this.right = options["right"];
    this.answer = eval(this.left + this.operation + this.right)
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

  var generateQuestion = function(){
    options = {
      left: GameRandomGenerator.randomNumber(),
      operation: GameRandomGenerator.randomOperator(),
      right: GameRandomGenerator.randomNumber(),
    }

    var q = new Question(options)
  };

  var startGame = function(){
    timer_is_on = true;
    $("#pause_button").find(".ui-btn-text").html("Pause");
    startTimer();
  }

  $("#start_button").click(function(){
    generateQuestion();
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