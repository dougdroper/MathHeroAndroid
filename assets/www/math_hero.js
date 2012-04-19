$(document).ready(function(){
  var timer;
  var timer_is_on = true;
  var next_question;

  var GameRandomGenerator = {
    randomNumber: function() {
      return Math.round(Math.random(12) * 12);
    },
    randomOperator: function() {
      var val = this.randomNumber();
      switch(true){
        case (val < 4):
          return "+";
          break;
        case (val >= 4 && val <= 6):
          return "*";
          break;
        case (val > 6 && val <= 9):
          return "/";
          break;
        default:
          return "-";
          break;
      }
    },
    randomAnswer: function(answer) {
      var random_answer = Math.floor(eval(answer + this.randomOperator() + Math.random(12) * 12));
      if (isFinite(answer) || random_answer !== answer) {
        return random_answer;
      } else {
        return this.randomAnswer();
      };
    },
    randomQuestion: function() {
      var options = {
        left_term: this.randomNumber(),
        operation: this.randomOperator(),
        right_term: this.randomNumber(),
        answer: function(){
          return eval(this.left_term + this.operation + this.right_term);
        }
      };

      if(options.answer() % 1 !== 0 || options.answer() < 0){
        return this.randomQuestion();
      } else {
        return new Question(options)
      }
    }
  };

  var shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  var Question = function(options) {

    var formatOperation = function() {
      if(options.operation === "*"){
        return "x";
      } else {
        return options.operation;
      }
    };

    this.answer = options.answer();

    $("#left_term").html(options.left_term)
    $("#operation").html(formatOperation());
    $("#right_term").html(options.right_term);
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
    var answer = next_question.answer
    var shuffled =  shuffle([1,2,3,4]);

    $("#answer_" + shuffled.pop() ).html(answer);
    $("#answer_" + shuffled.pop()).html(GameRandomGenerator.randomAnswer(answer));
    $("#answer_" + shuffled.pop()).html(GameRandomGenerator.randomAnswer(answer));
    $("#answer_" + shuffled.pop()).html(GameRandomGenerator.randomAnswer(answer));
  };

  var generateQuestion = function(){
    next_question = GameRandomGenerator.randomQuestion();
    generateAnswers();
    $("#calc_box").css('top', -20);
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

  $(".answers div").bind("click", function(e){
    e.preventDefault()
    if(parseInt($(this).html(), 10) === next_question.answer){
      generateQuestion();
    }
    return false;
  });

});