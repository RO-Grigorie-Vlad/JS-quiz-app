"use strict";
/** This is the main controller of the application. It is an IIFE function that acts like an API.
* We use the other three controllers (received as parameters) to achive the desired app behaviour.
* Returns an object containing the init() function.
* @module mainController
* @param {IIFEModule} QuizCtrl the QuizController
* @param {IIFEModule} AccCtrl the AccountController
* @param {IIFEModule} UICtrl the UIController
*/
var mainController = (function(QuizCtrl, AccCtrl, UICtrl){

    /**
     * @typedef {Object} IIFEModule
     * 
    */
    
    var DOM = UICtrl.getDOMstrings();

    /**
     * This function is used to setup the Event Listeners
     * @memberof module:mainController
     */
    var setupEventListeners = function(){
        // toggle witch forms are displayed
        document.querySelector(DOM.registerButton).addEventListener('click', UICtrl.displayRegisterForm);
        document.querySelector(DOM.loginButton).addEventListener('click', UICtrl.displayLoginForm);

        document.querySelector(DOM.submitRegisterButton).addEventListener("click", registerNewAccount);
        document.querySelector(DOM.submitLoginButton).addEventListener("click", login);
        document.querySelector(DOM.logoutButton).addEventListener("click", logout); 

        /*Note :
        Bind creates a new function that will force the this inside the function to be the parameter passed to bind().
        You can also add extra parameters after the 1st (this) parameter and bind will pass in those values to the original function. (this is why I used bind here)
        */ 
        document.querySelector(DOM.startJSQuizButton).addEventListener("click", startQuiz.bind(this, "JS"));
        document.querySelector(DOM.startJavaQuizButton).addEventListener("click", startQuiz.bind(this, "Java"));
        document.querySelector(DOM.startPythonQuizButton).addEventListener("click", startQuiz.bind(this, "Python"));

        document.querySelector(DOM.submitAnswerButton).addEventListener("click", submitAnswer);
        
    };
    
    /**
     * This function is used to login the user
     * @memberof module:mainController
     * @return {void}
     */
    var login = function(){
        // get the data introduced by the user
        var formData = UICtrl.getLoginFormData();
        console.log(formData);
        // log in the user
        var loggedInSuccesfully = AccCtrl.login(formData);
        // if login failed (wrong credentials)
        if(loggedInSuccesfully === false){
            UICtrl.displayMessage('Wrong credentials, try again!', 'danger'); 
        }
        // if login succesfull
        else{
            UICtrl.displayMessage('Successful login!', 'success');
            // loggedInSuccesfully[1] -> username
            var msg = 'Logged in as ' + loggedInSuccesfully + '. ';
            // Show the username of currently logged in account and the option(link) to logout
            UICtrl.displayLoggedInStatus(msg, 1);
            // make the form dissapear
            UICtrl.displayLoginForm();
            // make the StartQuiz Button apear
            UICtrl.displayQuizButtons();
            
        }
    };

    /**
     * This function is used to logout the user
     * @memberof module:mainController
     * @return {void}
     */
    var logout = function(){
        console.log('LOGOUT');
        // log out the user
        AccCtrl.logout();
        // show options(links) to login / register
        UICtrl.displayLoggedInStatus(null, 2);
        // if quiz is started - abandon it
        if(QuizCtrl.getQuizStatus() === true){
            QuizCtrl.abandonQuiz();
            //clear contents of the Quiz form
            UICtrl.resetQuiz();
            //hide the Quiz form
            UICtrl.displayQuizForm();
            //display login form
            UICtrl.displayLoginForm();
        }
        else{
            // hide the StartQuiz Button
            UICtrl.displayQuizButtons();
        }
        // hide the Score Board
        UICtrl.hideScoreBoard();
    };

    /**
     * This function is used to register a new Account
     * @memberof module:mainController
     * @return {void}
     */
    var registerNewAccount = function(){
        // get the data introduced by the user
        var formData = UICtrl.getRegisterFormData();
        console.log(formData);
        // register the user in the "database"
        var registerSuccesfull = AccCtrl.register(formData);
        if(registerSuccesfull){
            UICtrl.displayMessage('New account created successfully!', 'success');
            // display login form
            UICtrl.displayLoginForm();
            // hide register form
            UICtrl.displayRegisterForm;
        }else{
            UICtrl.displayMessage('There already is an account with this email!', 'danger');
        }
    };

    /**
     * This function is used to start a new quiz
     * @memberof module:mainController
     * @param {String} quizType - the quiz type
     * @return {void}
     */
    var startQuiz = function(quizType){
        // load the questions from the "JSON" file
        QuizCtrl.loadQuestions(quizType);
        // display the score board for the selected quiz
        var scoreBoard = QuizCtrl.getScoreBoard();
        UICtrl.displayScoreBoard(scoreBoard, quizType);
        // display the Quiz form
        UICtrl.displayQuizForm();
        // start the Quiz
        var firstQuestion = QuizCtrl.startQuiz(AccCtrl.getLoggedInAccount());
        // display the first question
        UICtrl.displayQuestion(firstQuestion, false);
        // make the startQuiz button dissapear
        UICtrl.displayQuizButtons();
    };

    /** 
     * This function is used to submit an answer to a question
     * @memberof module:mainController
     * @return {void}
     */
    var submitAnswer = function(){
        var chosenOption = UICtrl.getChosenOption();
        // if the user has chosen an answer
        if(chosenOption !== false){
            // check if answer is correct
            QuizCtrl.checkAnswer(parseInt(chosenOption));
            // get the next question
            var nextQuestionResult = QuizCtrl.getNextQuestion();
            // if there is a next question (the current question is not the last)
            if(nextQuestionResult !== null){
                var nextQuestion = nextQuestionResult[0];
                var isItLastQuestion = nextQuestionResult[1];
                // if this is not the last question - just display the question with its options
                if(isItLastQuestion !== true){
                    UICtrl.displayQuestion(nextQuestion, false);
                }
                // if it is the last question - display the question with its options AND change the text of the submit button to "Finish quiz"
                else{
                    UICtrl.displayQuestion(nextQuestion, true);
                }
            }
            // if there are no more questions - end the quiz
            else{
                var finalScore = QuizCtrl.finishQuiz();
                // reset the quiz form contents
                UICtrl.resetQuiz();
                // make the QuizForm dissapear
                UICtrl.displayQuizForm();
                // make the startQuiz button apear
                UICtrl.displayQuizButtons();
                // update the scoreBoard
                UICtrl.updateScoreBoard(finalScore);
                var scoreObtained =  QuizCtrl.getcurrentQuizScore();
                UICtrl.displayMessage('Your score is: ' + scoreObtained[0] + '/' + scoreObtained[1], 'success');
            }
        }
        // if the user has not chosen an answer
        else{
            UICtrl.displayMessage('Please select an answer.', 'warning');
        }
    };

    return {
        /**
         * The init funtion of the application. Calls the setupEventListeners() function.
         * @memberof module:mainController
         * @return {void}
         */
        init: function(){
            console.log('App Started!');
            setupEventListeners();
            // load the questions from the questions.js file (mock JSON, not really JSON - best I can do now)
            

            /* We can't load a JSON from a file on our system, it expects to get it from an URL
               so we would need to start a mini server and offer this file up.
               This is not included in the scope of this app. It is a JS-only app.
               What I did is that I loaded this "JSON" from JS variable (from the questions.js file) and converted it to JSON
               ... then back to JS. Not acomplishing much, but I wanted to try out JSON a bit. */
            

            /* Get json from external link:

            $.getJSON('https://run.mocky.io/v3/e6602b84-07e6-4f16-beab-49de7cc63345', function(data) {
                console.log(data);
            });
            */
        }
    }
})(QuizController, AccountsController, UIController);

mainController.init();