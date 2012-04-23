$(document).ready(function(){

  var timer,
      timer_is_on = true,
      next_question,
      NUMBER_OF_ANSWERS = 4,
      CLOCKCOUNT = 30,
      clock = CLOCKCOUNT,
      score = 0,
      questions_with_answers = [],
      question_index = 0;
      

  var GameRandomGenerator = {
    randomNumber: function(){
      return Math.round(Math.random() * 12);
    },
    randomSum: function() {
      var sum = {
        left_term: this.randomNumber(),
        right_term: this.randomNumber()
      };

      var val = this.randomNumber();
      switch(true){
        case (val < 4):
          sum.answer = sum.left_term + sum.right_term;
          sum.operator = "+";
          break;
        case (val >= 4 && val <= 6):
          sum.answer = sum.left_term * sum.right_term;
          sum.operator = "x";
          break;
        case (val > 6 && val <= 9):
          sum.answer = sum.left_term / sum.right_term;
          sum.operator = "/";
          break;
        default:
          sum.answer = sum.left_term - sum.right_term;
          sum.operator = "-";
          break;
      };

      return sum;
    },
    randomAnswersFor: function(answer) {

      var answers = [answer];
      var generateAnswer = function() {
        var random_answer = Math.floor(GameRandomGenerator.randomSum().answer);

        if (isFinite(random_answer) && random_answer % 1 === 0 && random_answer >= 0) {
          return random_answer;
        } else {
          return generateAnswer();
        };
      };

      var shuffle = function(o){
        var j, x, length = o.length;
        for(; length; j = parseInt(Math.random() * length, 10), x = o[--length], o[length] = o[j], o[j] = x);
        return o;
      };

      while(answers.length < 4) {
        var answer = generateAnswer();
        if(answers.indexOf(answer) === -1) {
          answers.push(answer);
        }
      };

      var AnswerIterator = function() {
        var suffled_answers = shuffle(answers),
            index = 0;
        return {
          answers: suffled_answers,

          next: function() {
            index += 1;
          },
          current: function() {
            return suffled_answers[index];
          },
          currentIndex: function() {
            return index;
          }
        }
      };

      return AnswerIterator();
    },
    randomQuestion: function() {
      var options = GameRandomGenerator.randomSum();

      if(options.answer % 1 !== 0 || options.answer < 0){
        return this.randomQuestion();
      } else {
        return options;
      }
    }
  };

  var Question = function(options) {
    this.answer = options.answer;

    $("#left_term").html(options.left_term)
    $("#operation").html(options.operator);
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

  var endGame = function(){
    $("#score_page .score").show();
    $.mobile.changePage( "#score_page", {transition: 'pop', role: 'dialog'});
  };

  var updateClock = function(time) {
    $("#clock").html(time);
  };

  var countDown = function(){
    updateClock(clock);
    clock = clock - 1;
    if(clock < 0) {
      timer_is_on = false;
      endGame();
    }

    if(timer_is_on){
      timer = setTimeout(countDown, 1000);
    }
  };

  var generateAnswers = function(){
    
    var answers = questions_with_answers[question_index].a
    

    for(var i = 0; i < NUMBER_OF_ANSWERS; i += 1) {
      $("#answer_" + answers.currentIndex()).html(answers.current());
      answers.next();
    }
  };

  var generateQuestion = function(){
    for(var i = 0; i < 40; i += 1){
      var question = GameRandomGenerator.randomQuestion();
      var answers = GameRandomGenerator.randomAnswersFor(question.answer);
      questions_with_answers.push({q: question, a : answers})
    }

    
    next_question = questions_with_answers[question_index].q
    new Question(next_question);
    generateAnswers();

    $("#calc_box").css('top', -20);
  };

  var startGame = function(){
    timer_is_on = true;
    clock = CLOCKCOUNT;
    score = 0;
    updateScore();
    $("#pause_button").find(".ui-btn-text").html("Pause");
    startTimer();
    countDown();
  }

  var updateScore = function(){
    $(".score").html(score);
  };

  $("#start_button").click(function(){
    generateQuestion();
    $(".answers").show();
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

  $(".answers a").bind("click", function(e){
    e.preventDefault()
    if(parseInt($(this).html(), 10) === next_question.answer){
      question_index += 1;
      score = score + 10 + (1000 - parseInt($("#calc_box").css("top"), 10))
      updateScore();
      generateQuestion();
    }
    return false;
  });

});