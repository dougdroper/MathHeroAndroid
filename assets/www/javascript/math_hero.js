$(document).bind('pageinit', function() {
  var game_logic = MHERO.game_logic();

  $(".new_game").click(function() {
    game_logic.newGame();
  });

});

if(typeof MHERO === "undefined") {
  var MHERO = {};
};

MHERO.game_logic = function(){
  var game;
  var question_control = MHERO.question_control();
  var time_control = MHERO.time_control();

  var ViewReset = function () {
    $("#calc_box").css('top', -20);
    $(".score").html("0");
    $("#pause_button").show();
    $(".answers").show();
  };

  var Game = function() {
    var questions_and_answers = question_control.QuestionGenerator();
    var that = this;
    ViewReset();
    
    this.question_index = 0;
    this.score = 0;

    this.nextQuestion = function () {
      return new question_control.Question(questions_and_answers[that.question_index].question);
    }

    this.nextSetOfAnswers = function () {
      question_control.drawNextSetOfAnswers(questions_and_answers[that.question_index].answers);
    }
  };

  var endGame = function() {
    time_control.timer_is_on = false;
    $("#pause_button").hide();
    $(".answers").hide();
    $("#score_page .score").show();
    $.mobile.changePage("#score_page", {transition: 'pop', role: 'dialog'});
  };

  var showPauseOverlay = function() {
    $("#modal_overlay").fadeIn(100);
  };

  var hidePauseOverlay = function() {
    $("#modal_overlay").fadeOut(100);
    time_control.moveDown();
  };

  var updateScore = function() {
    $(".score").html(game.score);
  };

  $("#pause_button").click(function() {
    time_control.resetTimer();
    showPauseOverlay();
  });

  $("#pause").click(function() {
    hidePauseOverlay();
  });

  $(".answers a").bind("vclick", function(e){
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
  return {
    newGame: function() {
      game = new Game();
      game.nextQuestion();
      game.nextSetOfAnswers();
      time_control.resetTimer();
      time_control.moveDown();
      time_control.startClock();
    }
  };
};
