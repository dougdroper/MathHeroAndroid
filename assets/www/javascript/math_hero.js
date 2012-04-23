$(document).ready(function(){

  var CLOCKCOUNT = 30;
  var NUMBER_OF_ANSWERS = 4;
  var game;
  var game_timer;
  var clock_timer;

  var QuestionGenerator = function () {
    var questions_with_answers = [], i;
    for(i = 0; i < 50; i += 1){
      var rand_question = GameRandomGenerator.randomQuestion();
      questions_with_answers.push({
        question: rand_question,
        answers : GameRandomGenerator.randomAnswersFor(rand_question.answer)
      });
    }
    return questions_with_answers;
  };

  var ViewReset = function () {
    $("#calc_box").css('top', -20);
    $(".score").html("0");
  }

  var Game = function(){
    var questions_and_answers = QuestionGenerator();
    var that = this;
    ViewReset();
    this.question_index = 0;
    this.timer_is_on = true;
    this.clock = CLOCKCOUNT;
    this.score = 0;

    this.nextQuestion = function () {
      return new Question(questions_and_answers[that.question_index].question);
    }

    this.nextSetOfAnswers = function () {
      drawNextSetOfAnswers(questions_and_answers[that.question_index].answers);
    }
  };

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
    $("#calc_box").css("top", -22);
    $("#left_term").html(options.left_term)
    $("#operation").html(options.operator);
    $("#right_term").html(options.right_term);
  };

  var drawNextSetOfAnswers = function(answers){
    for(var i = 0; i < NUMBER_OF_ANSWERS; i += 1) {
      $("#answer_" + answers.currentIndex()).html(answers.current());
      answers.next();
    }
  };

  var reachedDeadLine = function(){
    clearTimeout(game.timer);
    game.timer_is_on = false;
  };

  var movedown = function(){
    var calc_box = $("#calc_box");
    var calc_box_top = parseInt(calc_box.css("top"), 10);
    var dead_line = $("#dead_line").offset().top;

    if(calc_box_top + 58 <= dead_line){
      calc_box.css('top', calc_box_top + 5);
    } else {
      reachedDeadLine();
    }
  };

  var startTimer = function(){
    movedown();
    if(game.timer_is_on){
      game.timer = setTimeout(startTimer, 100);
    }
  };

  var endGame = function(){
    clearTimeout(game.clock_timer);
    $("#score_page .score").show();
    $.mobile.changePage( "#score_page", {transition: 'pop', role: 'dialog'});
  };

  var updateClock = function(time) {
    $("#clock").html(time);
  };

  var countDown = function(){
    updateClock(game.clock);
    game.clock = game.clock - 1;

    if(game.clock < 0) {
      game.timer_is_on = false;
      clearTimeout(game.clock_timer);
      endGame();
    }

    if(game.timer_is_on){
      game.clock_timer = setTimeout(countDown, 1000);
    }
  };

  var newGame = function(){
    game = new Game();
    clearTimeout(game.timer);
    clearTimeout(game.clock_timer);
    game.timer_is_on = true;
    game.nextQuestion();
    game.nextSetOfAnswers();
    startTimer();
    countDown();

    $("#pause_button").find(".ui-btn-text").html("Pause");
  }

  var updateScore = function(){
    $(".score").html(game.score);
  };

  $(".new_game").click(function(){
    newGame();
  });

  $("#pause_button").click(function(){
    var btn = $("#pause_button").find(".ui-btn-text");
    if(btn.html() === "Pause"){
      game.timer_is_on = false;
      clearTimeout(game.timer);
      btn.html("Continue");
    } else {
      startGame();
    }
  });

  $(".answers a").bind("click", function(e){
    e.preventDefault()
    if(parseInt($(this).html(), 10) === game.nextQuestion().answer){
      game.question_index += 1;
      game.score = game.score + 10 + (1000 - parseInt($("#calc_box").css("top"), 10))
      updateScore();
      game.nextQuestion();
      game.nextSetOfAnswers();
    }
    return false;
  });

});