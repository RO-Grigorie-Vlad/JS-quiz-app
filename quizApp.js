var AccountsController = (function(){

    //data structure for Accounts
    var Account = function(id, firstName, lastName, email, username, password){
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    };
    
    // mock database + loggedIn Accounts (to keep track of logged-in users)
    var data = {
        accounts: [],
        loggedInAccounts: [] // in this JS-only-no-backEnd-app there can only be one account logged-in at a time
    };

    // id and username of the currently logged in account
    var loggedInAccount = [];

    // general download function - used to download a file when called
    var download = function (content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    //convert JS object to JSON string
    var convertToJSON =  function(data){
        return JSON.stringify(data);
    };
    // JSON download function - used to download a json file that contains jsonData (JSON string -> JSON file)
    var downloadJson =  function(jsonData){
        download(jsonData, 'accounts.json', 'json');
    };

    return {
        // return "database"
        getData: function(){
            return data;
        },
        // register a new account
        register: function(formData){
            var idForNewAccount;
            var noDuplicateEmail = true;
        
            if(data.accounts.length > 0){
                idForNewAccount = data.accounts[data.accounts.length -1].id + 1;
            }
            else{
                idForNewAccount = 0;
            }
            // email has to be unique for each user
            data.accounts.forEach(account => {
                if(formData[2] === account.email){
                    noDuplicateEmail = false;
                }
            });

            if(noDuplicateEmail === true){
                var newAccount = new Account(idForNewAccount, formData[0], formData[1], formData[2], formData[3], formData[4]);
                console.log(newAccount);
                data.accounts.push(newAccount);
                return true;
            }
            else{
                return false;
            }
        },
        login: function(formData){
            var correctCredentials = false;
            var username, id;
            data.accounts.forEach(account => {
                if(account.email === formData[0]){
                    if(account.password === formData[1]){
                        // Correct login credentials
                        correctCredentials = true;
                        username = account.username;
                        id = account.id;
                        loggedInAccount.push(username);
                        loggedInAccount.push(id);
                        // add account to the currently logged-in users list
                        if(!data.loggedInAccounts.includes(account.id)){
                            data.loggedInAccounts.push(account.id);
                        }
                    }
                }
            });
            // if wrong credentials -> return false
            if(correctCredentials === false){
                return false;
            }// if correct credentials -> return the username of the user
            else{
                return username;
            }
        },
        logout: function(){
            // remove logged-in user from the data.loggedInAccounts list
            var index = data.loggedInAccounts.indexOf(loggedInAccount[1]);
            if (index > -1) {
                data.loggedInAccounts.splice(index, 1);
            }
            loggedInAccount = [];
            
        },
        // returns the username of the currently logged-in account
        getLoggedInAccount: function(){
            return loggedInAccount[0];
        },
        // download registered Accounts in a JSON file
        getAccountsJSONfile(){
            downloadJson(convertToJSON(data.accounts))
        }     
    };
})();

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
    var currentGame, currentQuestionIndex, isItLastQuestion, maxScore, lastRecord;
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
            currentGame = new Score(username, 0, maxScore);
            currentQuestionIndex = 0;
            quizStarted = true;
            return questions[currentQuestionIndex];
        },
        checkAnswer: function(answerIndex){
            if(answerIndex === questions[currentQuestionIndex].correct){
                currentGame.score +=1;
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
            // scoreBoard.push(currentGame);
            if(typeOfQuiz === "JS"){
                altScoreBoard.scoreBoardJSQuiz.push(currentGame);
            }
            else if(typeOfQuiz === "Java"){
                altScoreBoard.scoreBoardJavaQuiz.push(currentGame);
            }
            else{
                altScoreBoard.scoreBoardPythonQuiz.push(currentGame);
            }
            isItLastQuestion = null;
            currentQuestionIndex = null;
            quizStarted = false;
            lastRecord = new Score(currentGame.username, currentGame.score, currentGame.maxScore);
            currentGame = null;
            typeOfQuiz = null;
            return lastRecord;
        },
        // if the user logs out during the quiz
        abandonQuiz: function(){
            currentGame = null;
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
        getCurrentGameScore: function(){
            return [lastRecord.score, lastRecord.maxScore];
        }
    };

})();

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
    var loggedinInAs = document.querySelector(DOMstrings.loggedinInAs);

    var registerForm = document.querySelector(DOMstrings.registerForm);
    var loginForm = document.querySelector(DOMstrings.loginForm);

    var submitAnswerButton = document.querySelector(DOMstrings.submitAnswerButton);

    var scoreBoard = document.querySelector(DOMstrings.scoreBoard);

    // for alerts - will be displayed only a few seconds depending on alarm type
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
        //get the data introduced by the user in the Register Form
        getRegisterFormData: function(){
            var registerForm = document.querySelector(DOMstrings.registerForm);
            var formData = [];
            for(var i = 0; i < registerForm.elements.length - 1; i++){ // all elements, minus the submit button
                formData.push(registerForm.elements[i].value);
            }
            registerForm.reset(); // clear the form
            return formData;
        },
        //get the data introduced by the user in the Login Form
        getLoginFormData: function(){
            var loginForm = document.querySelector(DOMstrings.loginForm);
            var formData = [];
            for(var i = 0; i < loginForm.elements.length - 1; i++){ // all elements, minus the submit button
                formData.push(loginForm.elements[i].value);
            }
            loginForm.reset(); // clear the form
            return formData;
        },
        // display an alarm
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
            //type = 1 for login
            if(type === 1){
                loggedinInAs.innerHTML = msg;
            }
            //type = 2 for logout
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

            //update Score Board title
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
        // hide the Score Board
        hideScoreBoard: function(){
            scoreBoard.classList.add(DOMstrings.hiddenElem);
        },
        updateScoreBoard: function(record){
            var records = document.querySelector(DOMstrings.scores);
            records.innerHTML = records.innerHTML +'<tr><td>' + record.username + '</td><td>' + record.score  + '/' + record.maxScore + '</td></tr>';
        }

    };
})();

var mainController = (function(QuizCtrl, AccCtrl, UICtrl){

    var DOM = UICtrl.getDOMstrings();

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
    
    // Login
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

    //Logout
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
            // hide the Score Board
            UICtrl.hideScoreBoard()
        }
        else{
            // hide the StartQuiz Button
            UICtrl.displayQuizButtons();
        }
    };

    // Register a new Account
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

    var startQuiz = function(quizType){
        
        // load JS quiz questions from "JSON" file
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
        // make the start Quiz button dissapear
        UICtrl.displayQuizButtons();
    };

    var submitAnswer = function(){
        var chosenOption = UICtrl.getChosenOption();
        // if the user has chosen an answer
        if(chosenOption !== false){
            // check if answer is correct(increments score if correct)
            QuizCtrl.checkAnswer(parseInt(chosenOption));
            // get the next question
            var nextQuestionResult = QuizCtrl.getNextQuestion();
            // if there is a next question (the current question is not the last)
            if(nextQuestionResult !== null){
                var nextQuestion = nextQuestionResult[0];
                var isItLastQuestion = nextQuestionResult[1];
                // if this is not the last question - just display the question with the options
                if(isItLastQuestion !== true){
                    UICtrl.displayQuestion(nextQuestion, false);
                }
                // if it is the last question - display the question with the options + change the text of the submit button to "Finish quiz"
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
                var scoreObtained =  QuizCtrl.getCurrentGameScore();
                UICtrl.displayMessage('Your score is: ' + scoreObtained[0] + '/' + scoreObtained[1], 'success');
            }
        }
        // if the user has not chosen an answer
        else{
            UICtrl.displayMessage('Please select an answer.', 'warning');
        }
    };

    return {
        init: function(){
            console.log('App Started!');
            setupEventListeners();
            // load the questions from the questions.js file (mock JSON, not really JSON - best I can do now)
            

            // We can't load a JSON from a file on our system, it expects to get it from an URL
            // so we would need to start a mini server and offer this file up.
            // This is not included in the scope of this app. It is a JS-only app.
            // What I did is that I loaded this "JSON" from JS variable (from the questions.js file) and converted it to JSON
            // ... then back to JS. Not acomplishing much, but I wanted to try out JSON a bit. 
            

            /* Get json from external link:

            $.getJSON('https://run.mocky.io/v3/e6602b84-07e6-4f16-beab-49de7cc63345', function(data) {
                console.log(data);
            });
            */
        }
    }
})(QuizController, AccountsController, UIController);

mainController.init();