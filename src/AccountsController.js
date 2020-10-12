/**
* This is the Accounts Controller. It is an IIFE function that acts like an API.
* It has the following functions :
 - provides a data structure to save the accounts and keep track of the logged in users
 - offers the posibility to download this datastructure as a JSON file (didactic purpose)
 - handles the user registration, login and logout
* Returns an object containing a series of functions - aka the API
* @module AccountsController
*/
var AccountsController = (function(){
 
    /**
     * data structure (constructor function) for accounts
     * @memberof module:AccountsController
     */
    var Account = function(id, firstName, lastName, email, username, password){
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    };
    
    // mock database + loggedIn Accounts (to keep track of logged-in users)
    
    /**
     * Mock database + loggedIn Accounts (to keep track of logged-in users)
     * @memberof module:AccountsController
     */
    var data = {
        accounts: [],
        loggedInAccounts: [] // in this JS-only-no-backEnd-app there can only be one account logged-in at a time
    };

    /**
     * Array to store the id and username of the currently logged in account
     * @memberof module:AccountsController
     */
    var loggedInAccount = [];

    // general download function - used to download a file when called
    var download = function (content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    // convert JS object to JSON string
    var convertToJSON =  function(data){
        return JSON.stringify(data);
    };
    // JSON download function - used to download a json file that contains jsonData (JSON string -> JSON file)
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
            if(correctCredentials === false){
                return false;
            }
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
        getLoggedInAccount: function(){
            return loggedInAccount[0];
        },
        // download registered Accounts in a JSON file
        getAccountsJSONfile(){
            downloadJson(convertToJSON(data.accounts))
        }     
    };
})();
