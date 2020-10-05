var AccountsController = (function(){

    var Account = function(id, firstName, lastName, email, username, password){
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    };
    
    //mock database + loggedIn Accounts (to keep track of logged-in users)
    var data = {
        accounts: [],
        loggedInAccounts: [] // in this JS-only-no-backEnd-App there can only be one account logged-in
    };

    var download = function (content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    var convertToJSON =  function(data){
        return JSON.stringify(data);
    };

    var downloadJson =  function(jsonData){
        download(jsonData, 'accounts.json', 'json');
    };

    return {
        getData: function(){
            return data;
        },
        register: function(formData){
            var idForNewAccount;
            var noDuplicateEmail = true;
        
            if(data.accounts.length > 0){
                idForNewAccount = data.accounts[data.accounts.length -1].id + 1;
            }
            else{
                idForNewAccount = 0;
            }
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
                        // add account to the currently logged-in users list
                        if(!data.loggedInAccounts.includes(account.id)){
                            data.loggedInAccounts.push(account.id);
                        }
                    }
                }
            });
            if(correctCredentials === false){
                return false;
            }
            else{
                return [username, id];
            }
        },
        logout: function(id){
            // remove logged-in user from the data.loggedInAccounts list

            var index = data.loggedInAccounts.indexOf(id);
            if (index > -1) {
                data.loggedInAccounts.splice(index, 1);
            }

            //data.loggedInAccounts = [];
            
        },
        getAccountsJSONfile(){
            downloadJson(convertToJSON(data.accounts))
        }     
    };
})();

var QuizController = (function(){

    // object to store the score achived by every user
    var Score = function(username, score){
        this.score = score;
        this.username = username;
    };

    // the quiz questions -  loaded in the init() method from questions.js file
    var questions = [];

    // scores of all users
    // will be populated with Score objects
    var scoreBoard = [];
    var currentGame;

    return{
        loadQuestions: function(){
            questions = JSON.parse(jsonQuestions);
        },
        getQuestions: function(){
            return questions;
        },
        startQuiz: function(username){
            currentGame = new Score(username, 0);
            return questions[0];
        },
        checkAnswer: function(answerIndex, questionIndex){
            if(answerIndex === questions[questionIndex].correct){
                currentGame.score +=1;
            }
        },
        getNextQuestion: function(currentQuestionIndex){
            if(currentQuestionIndex < questions.length - 1){
                return questions[currentQuestionIndex+1];
            }
            else{
                return null;
            }
        },
        finishQuiz: function(){
            scoreBoard.push(currentGame);
            currentGame = null;
        },
        getScoreBoard: function(){
            return scoreBoard;
        },
        //for testing
        getCurrentGame: function(){
            return currentGame;
        }
    };



})();

var UIController = (function(){

    var DOMstrings = {
        registerForm: '#registerForm',
        loginForm: '#loginForm',
        registerButton: '#registerButton',
        loginButton: '#loginButton',
        submitRegister: '#submitRegister',
        submitLogin: '#submitLogin',
        hiddenElem: 'hiddenElem',
        visibility: 'visibility',
        message: '#message',
        loginStatus: '#loginStatus',
        logginInAs: '#logginInAs',
        logout: '#logout',
        logoutButton: '#logoutButton'
    };

    
    var logoutH4 = document.querySelector(DOMstrings.logout);
    var logginInAs = document.querySelector(DOMstrings.logginInAs);

    return {
        getDOMstrings: function(){
            return DOMstrings;
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
        // display a message in a paragraph (succes/fail on register and login)
        displayMessage: function(msg){
            var messageParagraph = document.querySelector(DOMstrings.message);
            messageParagraph.innerHTML = msg;
            
            setTimeout(function(){
                messageParagraph.innerHTML = '';
            }, 2000);
        },
        displayLoggedInStatus: function(msg, type){
            console.log('displayLoggedInStatus() called');
            logoutH4.classList.toggle(DOMstrings.hiddenElem);
            loginStatus.classList.toggle(DOMstrings.hiddenElem);
            if(type === 1){//login
                logginInAs.innerHTML = msg;
            }
            //type = 2 at logout
        }
    };
})();

var mainController = (function(QuizCtrl, AccCtrl, UICtrl){

    var DOM = UICtrl.getDOMstrings();

    var registerForm = document.querySelector(DOM.registerForm);
    var loginForm = document.querySelector(DOM.loginForm);

    var submitRegister = document.querySelector(DOM.submitRegister);
    var submitLogin = document.querySelector(DOM.submitLogin);

    var setupEventListeners = function(){
        //toggle witch forms are displayed
        document.querySelector(DOM.registerButton).addEventListener('click', function(){
            if(!loginForm.classList.contains(DOM.hiddenElem)){
                loginForm.classList.toggle(DOM.hiddenElem);
            }
            registerForm.classList.toggle(DOM.hiddenElem);
        });
        document.querySelector(DOM.loginButton).addEventListener('click', function(){
            if(!registerForm.classList.contains(DOM.hiddenElem)){
                registerForm.classList.toggle(DOM.hiddenElem);
            }
            loginForm.classList.toggle(DOM.hiddenElem);
        });

        submitRegister.addEventListener("click", registerNewAccount);
        submitLogin.addEventListener("click", login);
        
        document.querySelector(DOM.logoutButton).addEventListener("click", logout);
    };
    var loggedInAccountID;

    // Login
    var login = function(){
        var formData = UICtrl.getLoginFormData();
        console.log(formData);
        var loggedInSuccesfully = AccCtrl.login(formData);
        if(loggedInSuccesfully === false){
            UICtrl.displayMessage('Wrong credentials, try again!'); 
        }
        else{
            UICtrl.displayMessage('Successful login!');
            // loggedInSuccesfully[1] -> username
            var msg = 'Logged in as ' + loggedInSuccesfully[0] + '. ';
            UICtrl.displayLoggedInStatus(msg, 1);
            loggedInAccountID = loggedInSuccesfully[1];
            // make the form dissapear
            loginForm.classList.toggle(DOM.hiddenElem);
        }
    };

    //Logout
    var logout = function(){
        AccCtrl.logout(loggedInAccountID);
        loggedInAccountID = null;
        UICtrl.displayLoggedInStatus(null, 2);
        //logoutH4.classList.toggle(DOM.hiddenElem);
        //loginStatus.classList.toggle(DOM.hiddenElem);
    };

    // Register a new Account
    var registerNewAccount = function(){
        var formData = UICtrl.getRegisterFormData();
        console.log(formData);
        var registerSuccesfull = AccCtrl.register(formData);
        if(registerSuccesfull){
            UICtrl.displayMessage('New account created successfully!');
        }else{
            UICtrl.displayMessage('There already is an account with this email!');
        }
    };

    return {
        init: function(){
            console.log('App Started!');
            setupEventListeners();
            QuizCtrl.loadQuestions();

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

