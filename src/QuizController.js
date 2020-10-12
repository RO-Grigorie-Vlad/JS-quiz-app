/**
* This is the Quiz Controller. It is an IIFE function that acts like an API.
* It has the following functions :
 - Loads the quiz questions for the type of quiz received.
 - Handles the quiz initialization and termination.
 - Checks if the answers received for each question are correct (one at a time).
 - Keeps track of the user's score in the current quiz.
 - Provides a data structure to save all the final scores of all users;
* Returns an object containing a series of functions - aka the API
* @module QuizController
*/
var QuizController = (function(){

    // object to store the score achived by a user
    var Score = function(username, score, maxScore){
        this.score = score;
        this.username = username;
        this.maxScore = maxScore;
    };

    // the quiz questions - will be loaded from questions.js
    var questions = [];

    // scores of all users
    // will be populated with Score objects
    var altScoreBoard = {
        scoreBoardJSQuiz : [],
        scoreBoardJavaQuiz : [],
        scoreBoardPythonQuiz : []
    }

    var typeOfQuiz;
    var currentQuiz, currentQuestionIndex, isItLastQuestion, maxScore, lastRecord;
    var quizStarted = false;

    return{
        //load the questions from the questions.js file in the questions variable
        loadQuestions: function(quizType){
            typeOfQuiz = quizType;
            if(quizType === "JS"){
                console.log("JS questions loaded");
                questions = JSON.parse(jsonJSQuestions);
            }
            else if(quizType === "Java"){
                console.log("Java questions loaded");
                questions = JSON.parse(jsonJavaQuestions);
            }
            else{
                console.log("Python questions loaded");
                questions = JSON.parse(jsonPythonQuestions);
            }
            maxScore = questions.length;
        },
        getQuestions: function(){
            return questions;
        },
        startQuiz: function(username){
            currentQuiz = new Score(username, 0, maxScore);
            currentQuestionIndex = 0;
            quizStarted = true;
            return questions[currentQuestionIndex];
        },
        checkAnswer: function(answerIndex){
            if(answerIndex === questions[currentQuestionIndex].correct){
                currentQuiz.score +=1;
                console.log("Correct answer!");
            }
        },
        getNextQuestion: function(){
            if(currentQuestionIndex < questions.length - 1){
                console.log(currentQuestionIndex);
                console.log(questions.length - 2);
                if(currentQuestionIndex === questions.length - 2){
                    isItLastQuestion = true;
                    console.log("No more questions after this one");
                }
                else{
                    isItLastQuestion = false;
                }
                currentQuestionIndex += 1;
                return [questions[currentQuestionIndex], isItLastQuestion];
            }
            else{
                console.log("No more questions");
                return null;
            }
        },
        finishQuiz: function(){
            // add score to the scoreBoard data structure and reset all other variables
            if(typeOfQuiz === "JS"){
                altScoreBoard.scoreBoardJSQuiz.push(currentQuiz);
            }
            else if(typeOfQuiz === "Java"){
                altScoreBoard.scoreBoardJavaQuiz.push(currentQuiz);
            }
            else{
                altScoreBoard.scoreBoardPythonQuiz.push(currentQuiz);
            }
            // reset the quiz
            isItLastQuestion = null;
            currentQuestionIndex = null;
            quizStarted = false;
            lastRecord = new Score(currentQuiz.username, currentQuiz.score, currentQuiz.maxScore);
            currentQuiz = null;
            typeOfQuiz = null;
            return lastRecord;
        },
        // if the user logs out during the quiz - abandon it
        abandonQuiz: function(){
            currentQuiz = null;
            isItLastQuestion = null;
            currentQuestionIndex = null;
            quizStarted = false;
            console.log("Quiz abandoned");
        },
        getQuizStatus: function(){
            return quizStarted;
        },
        getScoreBoard: function(){
            if(typeOfQuiz === "JS"){
                return altScoreBoard.scoreBoardJSQuiz;
            }
            else if(typeOfQuiz === "Java"){
                return altScoreBoard.scoreBoardJavaQuiz;
            }
            else{
                return altScoreBoard.scoreBoardPythonQuiz;
            }
        },
        getAllScoreBoards: function(){
            return altScoreBoard;
        },
        //for testing
        getcurrentQuizScore: function(){
            return [lastRecord.score, lastRecord.maxScore];
        }
    };

})();