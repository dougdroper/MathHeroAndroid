if(typeof MHERO === "undefined") {
  var MHERO = {};
};

MHERO.question_control = function() {
  
  var NUMBER_OF_ANSWERS = 4;

  var randomNumber = function() {
    return Math.round(Math.random() * 12);
  };

  var addition = function(sum){
    sum.answer = sum.left_term + sum.right_term;
    sum.operator = "+";
    return sum;
  };

  var multiplication = function(sum){
    sum.answer = sum.left_term * sum.right_term;
    sum.operator = "x";
    return sum;
  };

  var division = function(sum){
    sum.answer = sum.left_term / sum.right_term;
    sum.operator = "/";
    return sum;
  };

  var subtraction = function(sum){
    sum.answer = sum.left_term - sum.right_term;
    sum.operator = "-";
    return sum;
  };

  var randomFunction = function(sum){
    var fn = [addition, multiplication, division, subtraction]
    fn[Math.floor(Math.random() * 4)](sum);
  };

  var randomSum = function() {
    var sum = {
      left_term: randomNumber(),
      right_term: randomNumber()
    };

    randomFunction(sum);

    return sum;
  };

  var randomQuestion = function() {
    var sum = randomSum();

    if(sum.answer % 1 !== 0 || sum.answer < 0){
      return randomQuestion();
    } else {
      return sum;
    }
  };

  var randomAnswersFor = function(answer) {
    var answers = [answer];
    var generateAnswer = function() {
      var random_answer = Math.floor(randomSum().answer);

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
  };


  return {
    QuestionGenerator: function() {
      var questions_with_answers = [], i;
      for(i = 0; i < 50; i += 1){
          var rand_question = randomQuestion();
          questions_with_answers.push({
            question: rand_question,
            answers : randomAnswersFor(rand_question.answer)
          });
        }
      return questions_with_answers;
    },
    Question: function(options) {
      this.answer = options.answer;
      $("#calc_box").css("top", -22);
      $("#left_term").html(options.left_term)
      $("#operation").html(options.operator);
      $("#right_term").html(options.right_term);
    },
    drawNextSetOfAnswers: function(answers){
      for(var i = 0; i < NUMBER_OF_ANSWERS; i += 1) {
        $("#answer_" + answers.currentIndex()).html(answers.current());
        answers.next();
      }
    }
  };
};