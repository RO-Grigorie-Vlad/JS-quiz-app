"use strict";
/** This is the Accounts Controller. It is an IIFE function that acts like an API.
* It has the following functions :
 - provides a data structure to save the accounts and keep track of the logged in users
 - offers the posibility to download this datastructure as a JSON file (didactic purpose)
 - handles the user registration, login and logout
* Returns an object containing a series of functions - aka the API
* @module AccountsController
*/
var AccountsController = (function(){
 
    /** Data structure (constructor function) for accounts
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
    
    /** Mock database of currently registered users and to keep track of logged-in users
     * @memberof module:AccountsController
     */
    var data = {
        accounts: [],
        loggedInAccounts: [] // in this JS-only-no-backEnd-app there can only be one account logged-in at a time
    };

    /** Array to store the id and username of the currently logged in account
     * @memberof module:AccountsController
     */
    var loggedInAccount = [];

    /** General download method - used to make download a file when called using a JSON string received as argumment.
     * @memberof module:AccountsController
     * @param {String} content - content of the file to be downloaded
     * @param {String} fileName - name of the file to be downloaded
     * @param {String} contentType - type of the file to be downloaded
     * @return {File} - the file
     */
    var download = function (content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    /** Method used to convert JS object to JSON string.
     * @memberof module:AccountsController
     * @param {Object} data - JS object to be converted
     * @returns {String} - JSON string
     */
    var convertToJSON =  function(data){
        return JSON.stringify(data);
    };

    /** JSON download method - calls the download() method to download a file that contains data about the account currently registered users (data.accounts).
     * @memberof module:AccountsController
     * @param {String} jsonData - content of the JSON file to be downloaded
     * @return {File} - the file
     */
    var downloadJson =  function(jsonData){
        download(jsonData, 'accounts.json', 'json');
    };

    return {
        /** Method used to retrive the *data* (mock accounts database).
         * @memberof module:AccountsController
         * @returns {Object} - mock accounts database
         */
        getData: function(){
            return data;
        },
        /** Method used to register a new user.
         * @memberof module:AccountsController
         * @param {Array} formData - the data introduced by the user in the register form
         * @returns {Boolean} - returns true if the user was succesfully registered or false if the process failed (email address already taken).
         */
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
        /** Method used to login a user
         * @memberof module:AccountsController
         * @param {Array} formData - the data introduced by the user in the login form
         * @returns {(String|Boolean)} - returns the username if the user was succesfully logged in or false if the process failed (wrong credentials).
         */
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
        /** Method used to logout the currently logged in user
         * @memberof module:AccountsController
         * @returns {void}
         */
        logout: function(){
            // remove logged-in user from the data.loggedInAccounts list
            var index = data.loggedInAccounts.indexOf(loggedInAccount[1]);
            if (index > -1) {
                data.loggedInAccounts.splice(index, 1);
            }
            loggedInAccount = [];
            
        },
        /** Method used to get the currently logged in users username
         * @memberof module:AccountsController
         * @returns {String} - returns the currently logged in user's username
         */
        getLoggedInAccount: function(){
            return loggedInAccount[0];
        },
        /** Method used to call the downloadJson() method.
         * @memberof module:AccountsController
         * @returns {File} - returns the currently logged in user's username
         */
        getAccountsJSONfile(){
            downloadJson(convertToJSON(data.accounts))
        }     
    };
})();
