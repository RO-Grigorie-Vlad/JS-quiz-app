/**
* This is the User Interface Controller. It is an IIFE function that acts like an API.
* It has two functions :
 - Handles/modifies the DOM.
 - Collects and returns the data introduced by the user.
* Returns an object containing a series of functions - aka the API
* @module UIController
*/
var UIController = (function(){

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
    

    var registerForm = document.querySelector(DOMstrings.registerForm);
    var loginForm = document.querySelector(DOMstrings.loginForm);
    var loggedinInAs = document.querySelector(DOMstrings.loggedinInAs);
    var submitAnswerButton = document.querySelector(DOMstrings.submitAnswerButton);
    var scoreBoard = document.querySelector(DOMstrings.scoreBoard);

    // timer for alerts - will be interupted if another alarm fires during the first one
    var timer;

    return {
        getDOMstrings: function(){
            return DOMstrings;
        },
        // display Login Form and make the Register form disappear if present
        displayLoginForm: function(){
            if(!registerForm.classList.contains(DOMstrings.hiddenElem)){
                registerForm.classList.toggle(DOMstrings.hiddenElem);
            }
            loginForm.classList.toggle(DOMstrings.hiddenElem);
        },
        // display Register Form and make the Login form disappear if present
        displayRegisterForm: function(){
            if(!loginForm.classList.contains(DOMstrings.hiddenElem)){
                loginForm.classList.toggle(DOMstrings.hiddenElem);
            }
            registerForm.classList.toggle(DOMstrings.hiddenElem);
        },
        // get the data introduced by the user in the Register Form
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
        // get the data introduced by the user in the Login Form
        getLoginFormData: function(){
            var loginForm = document.querySelector(DOMstrings.loginForm);
            var formData = [];
            for(var i = 0; i < loginForm.elements.length - 1; i++){ // all the form elements, minus the submit button
                formData.push(loginForm.elements[i].value);
            }
            // clear the Login
            loginForm.reset(); 
            return formData;
        },
        // display an alarm for a few seconds
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
        //
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
        displayQuizButtons: function(){
            document.querySelector(DOMstrings.startQuizButtonGroup).classList.toggle(DOMstrings.hiddenElem);
        },
        displayQuizForm: function(){
            document.querySelector(DOMstrings.questionForm).classList.toggle(DOMstrings.hiddenElem);
        },
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
        hideScoreBoard: function(){
            if(!scoreBoard.classList.contains(DOMstrings.hiddenElem)){
                scoreBoard.classList.add(DOMstrings.hiddenElem);
            }
        },
        updateScoreBoard: function(record){
            var records = document.querySelector(DOMstrings.scores);
            records.innerHTML = records.innerHTML +'<tr><td>' + record.username + '</td><td>' + record.score  + '/' + record.maxScore + '</td></tr>';
        }

    };
})();