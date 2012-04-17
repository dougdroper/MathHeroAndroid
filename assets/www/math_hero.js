$(document).ready(function(){
  var timer;
  var timer_is_on = true;
  var next_question;

  var GameRandomGenerator = {
    randomNumber: function(){
      return Math.round(Math.random(10) * 10);
    },
    randomOperator: function(){
      var val = this.randomNumber();
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

  var Question = function(){
    var left_term = GameRandomGenerator.randomNumber();
    var operation = GameRandomGenerator.randomOperator();
    var right_term = GameRandomGenerator.randomNumber();
    $("#left_term").html(left_term);
    $("#operation").html(operation);
    $("#right_term").html(right_term);
    this.answer = function(){
      return eval(left_term + operation + right_term)
    }
  };

  var reachedDeadLine = function(){
    clearTimeout(timer);
    timer_is_on = false;
  };

  var movedown = function(){
    var calc_box = $("#calc_box");
    var calc_box_top = parseInt($("#calc_box").css("top"), 10);
    var dead_line = $("#dead_line").offset().top;

    if(calc_box_top + 58 <= dead_line){
      calc_box.css('top', calc_box_top + 5);  
    } else {
      reachedDeadLine();
    }
  };

  var startTimer = function(){
    movedown();
    if(timer_is_on){
      timer = setTimeout(startTimer, 100);
    }
  };

  var generateAnswers = function(){
    var answer = next_question.answer()
    $("#answer_1").html(answer);
    $("#answer_2").html(answer - 1);
    $("#answer_3").html(answer + 1);
    $("#answer_4").html(answer * 2);
  };

  var generateQuestion = function(){
    next_question = new Question();
    generateAnswers();
    $("#calc_box").css('top', 0);
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

  $("#answer_1").click(function(e){
    e.preventDefault()
    if(parseInt($(this).html(), 10) === next_question.answer()){
      generateQuestion();
    }
    return false;
  });

});