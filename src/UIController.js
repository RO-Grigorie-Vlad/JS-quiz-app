"use strict";
/** This is the User Interface Controller. It is an IIFE function that acts like an API.
* It has two functions :
 - Handles/modifies the DOM.
 - Collects and returns the data introduced by the user.
* Returns an object containing a series of functions - aka the API
* @module UIController
*/
var UIController = (function(){

    /** Object used to store the identifiers of DOM elements (class/id names, name etc.).
     * @memberof module:UIController
     */
    var DOMstrings = {
        registerForm: '#registerForm',
        loginForm: '#loginForm',
        registerButton: '#registerButton',
        loginButton: '#loginButton',
        submitRegisterButton: '#submitRegister',
        submitLoginButton: '#submitLogin',
        hiddenElem: 'hiddenElem',
        messageSuccess: '#messageSuccess',
        messageWarning: '#messageWarning',
        messageDanger: '#messageDanger',
        loginH4: '#loginH4',
        logoutH4: '#logoutH4',
        loggedinInAs: '#loggedinInAs',
        logoutButton: '#logoutButton',
        startQuizButtonGroup:'#startQuizButtonGroup',
        startJSQuizButton: '#startJSQuizButton',
        startJavaQuizButton: '#startJavaQuizButton',
        startPythonQuizButton: '#startPythonQuizButton',
        questionForm: '#questionForm',
        questionText: '#questionText',
        optionOne: '#optionOne',
        optionTwo: '#optionTwo',
        optionThree: '#optionThree',
        optionFour: '#optionFour',
        submitAnswerButton: '#submitAnswer',
        optionsAnswers: 'optionsAnswers',
        scoreBoard: '#scoreBoard',
        scores: '#scores',
        scoreBoardTitle: '#scoreBoardTitle'
    };
    
    /** The register form.
     * @memberof module:UIController
     */
    var registerForm = document.querySelector(DOMstrings.registerForm);
    /** The login form.
     * @memberof module:UIController
     */
    var loginForm = document.querySelector(DOMstrings.loginForm);
    /** Span element that shows the logged-in user's username.
     * @memberof module:UIController
     */
    var loggedinInAs = document.querySelector(DOMstrings.loggedinInAs);
    /** Button used to submit and answer during the quiz.
     * @memberof module:UIController
     */
    var submitAnswerButton = document.querySelector(DOMstrings.submitAnswerButton);
    /** Table that will display the scoreboard.
     * @memberof module:UIController
     */
    var scoreBoard = document.querySelector(DOMstrings.scoreBoard);

    // 
    /** Timer for alerts. It will be interupted if another alarm fires during the first one.
     * @memberof module:UIController
     */
    var timer;

    return {
        /** Method used to get the DOMstrings variable.
        * @memberof module:UIController
        * @return {Object} - the DOM strings
        */
        getDOMstrings: function(){
            return DOMstrings;
        },
        /** Method used to display the login form and make the register form disappear, if present.
        * @memberof module:UIController
        * @return {void}
        */
        displayLoginForm: function(){
            if(!registerForm.classList.contains(DOMstrings.hiddenElem)){
                registerForm.classList.toggle(DOMstrings.hiddenElem);
            }
            loginForm.classList.toggle(DOMstrings.hiddenElem);
        },
        /** Method used to display register form and make the login form disappear if present.
        * @memberof module:UIController
        * @return {void}
        */
        displayRegisterForm: function(){
            if(!loginForm.classList.contains(DOMstrings.hiddenElem)){
                loginForm.classList.toggle(DOMstrings.hiddenElem);
            }
            registerForm.classList.toggle(DOMstrings.hiddenElem);
        },
        /** Method used to get the data introduced by the user
        * @memberof module:UIController
        * @return {Array} - form data 
        */
        getRegisterFormData: function(){
            var registerForm = document.querySelector(DOMstrings.registerForm);
            var formData = [];
            for(var i = 0; i < registerForm.elements.length - 1; i++){ // the form elements, minus the submit button
                formData.push(registerForm.elements[i].value);
            }
            // clear the Register form
            registerForm.reset(); 
            return formData;
        },
        /** Method used to get the data introduced by the user in the login form.
        * @memberof module:UIController
        * @return {Array} - form data 
        */
        getLoginFormData: function(){
            var loginForm = document.querySelector(DOMstrings.loginForm);
            var formData = [];
            for(var i = 0; i < loginForm.elements.length - 1; i++){ // all the form elements, minus the submit button
                formData.push(loginForm.elements[i].value);
            }
            // clear the Login form
            loginForm.reset(); 
            return formData;
        },
        /** Method used to display an alarm for a few seconds
        * @memberof module:UIController
        * @param {String} msg - the message to be displayed
        * @param {String} type - the alarm type
        * @return {void}
        */
        displayMessage: function(msg, type){
            var messageParagraph, duration;

            if(type === "success"){
                messageParagraph = document.querySelector(DOMstrings.messageSuccess);
                duration = 3000;
            }
            else if(type === "warning"){
                messageParagraph = document.querySelector(DOMstrings.messageWarning);
                duration = 2000;
            }
            else{
                messageParagraph = document.querySelector(DOMstrings.messageDanger);
                duration = 3000;
            }

            if(messageParagraph.classList.contains(DOMstrings.hiddenElem)){
                messageParagraph.classList.remove(DOMstrings.hiddenElem)
            }
            else{
                window.clearTimeout(timer);
            }

            messageParagraph.innerHTML = msg;
            
            timer = window.setTimeout(function(){
                messageParagraph.classList.toggle(DOMstrings.hiddenElem);
                messageParagraph.innerHTML = '';
            },duration); 
            
        },
        /** Method used to display a message in the jumbotron element ("hello ..." message if logged in; "please login" message if logged off).
        * @memberof module:UIController
        * @param {String} msg - the message to be displayed
        * @param {Number} type - the logged in status
        * @return {void}
        */
        displayLoggedInStatus: function(msg, type){
            console.log('displayLoggedInStatus() called');
            document.querySelector(DOMstrings.logoutH4).classList.toggle(DOMstrings.hiddenElem);
            document.querySelector(DOMstrings.loginH4).classList.toggle(DOMstrings.hiddenElem);
            // type = 1 for login
            if(type === 1){
                loggedinInAs.innerHTML = msg;
            }
            // type = 2 for logout
            else{
                loggedinInAs.innerHTML = "";
            }
        },
        /** Method used to display the start-quiz buttons.
        * @memberof module:UIController
        * @return {void}
        */
        displayQuizButtons: function(){
            document.querySelector(DOMstrings.startQuizButtonGroup).classList.toggle(DOMstrings.hiddenElem);
        },
        /** Method used to display the quiz form.
        * @memberof module:UIController
        * @return {void}
        */
        displayQuizForm: function(){
            document.querySelector(DOMstrings.questionForm).classList.toggle(DOMstrings.hiddenElem);
        },
        /** Method used to display a question in the quiz form (populate the form).
        * @memberof module:UIController
        * @param {Question} question - the question to be displayed
        * @param {Boolean} isItLastQuestion - flag to mark if the question to be displayed is the last one
        * @return {void}
        */
        displayQuestion: function(question, isItLastQuestion){
            document.querySelector(DOMstrings.questionText).innerHTML = question.questionText;
            document.querySelector(DOMstrings.optionOne).textContent = question.options[0];
            document.querySelector(DOMstrings.optionTwo).textContent = question.options[1];
            document.querySelector(DOMstrings.optionThree).textContent = question.options[2];
            document.querySelector(DOMstrings.optionFour).textContent = question.options[3];
            // deselect the radio from the previous question - if there was a previous answer
            var previousAnswer = document.querySelector('input[name="' + DOMstrings.optionsAnswers + '"]:checked');
            if(previousAnswer !== null){
                previousAnswer.checked = false;
            }
            if(isItLastQuestion === true){
                submitAnswerButton.value = 'Finish quiz';
            }
        },
        /** Method used to get the option chosen by the user to the current question.
        * @memberof module:UIController
        * @return {void}
        */
        getChosenOption: function(){
            var chosenOption = document.querySelector('input[name="' + DOMstrings.optionsAnswers + '"]:checked');
            if(chosenOption !== null){
                console.log("CHOSEN: " + chosenOption.value);
                return chosenOption.value;
            }
            else{
                return false;
            }
        },
        /** Method used clear and hide the quiz form in case of reset.
        * @memberof module:UIController
        * @return {void}
        */
        resetQuiz: function(){
            var questionForm = document.querySelector(DOMstrings.questionForm);
            questionForm.reset();
            document.querySelector(DOMstrings.questionText).innerHTML = "";
            submitAnswerButton.value = 'Submit answer';
            var previousAnswer = document.querySelector('input[name="' + DOMstrings.optionsAnswers + '"]:checked');
            if(previousAnswer !== null){
                previousAnswer.checked = false;
            }
        },
        /** Method used to display the scoreboard.
        * @memberof module:UIController
        * @param {Array} board - the scoreboard data
        * @param {String} quizType - the scoreboard type
        * @return {void}
        */
        displayScoreBoard: function(board, quizType){
            // display the Score Board
            scoreBoard.classList.remove(DOMstrings.hiddenElem);
            // populate the score Board with the records in the "database"
            var records = document.querySelector(DOMstrings.scores);
            records.innerHTML = null;

            // update Score Board title
            var scoreBoardTitle = document.querySelector(DOMstrings.scoreBoardTitle);
            if(quizType === "JS"){
                scoreBoardTitle.textContent = "JS Quiz Scoreboard";
            }
            else if(quizType === "Java"){
                scoreBoardTitle.textContent = "Java Quiz Scoreboard";
            }
            else{
                scoreBoardTitle.textContent = "Python Quiz Scoreboard";
            }

            if(board != null){
                board.forEach(record => {
                    records.innerHTML = records.innerHTML +'<tr><td>' + record.username + '</td><td>' + record.score  + '/' + record.maxScore + '</td></tr>';
                });
            } 
        },
        /** Method used to hide the scoreboard.
        * @memberof module:UIController
        * @return {void}
        */
        hideScoreBoard: function(){
            if(!scoreBoard.classList.contains(DOMstrings.hiddenElem)){
                scoreBoard.classList.add(DOMstrings.hiddenElem);
            }
        },
        /** Method used to add a new score to the scoreboard.
        * @memberof module:UIController
        * @param {Score} record - the new score
        * @return {void}
        */
        updateScoreBoard: function(record){
            var records = document.querySelector(DOMstrings.scores);
            records.innerHTML = records.innerHTML +'<tr><td>' + record.username + '</td><td>' + record.score  + '/' + record.maxScore + '</td></tr>';
        }

    };
})();