## Modules

<dl>
<dt><a href="#module_AccountsController">AccountsController</a></dt>
<dd><p>This is the Accounts Controller. It is an IIFE function that acts like an API.
It has the following functions :</p>
<ul>
<li>provides a data structure to save the accounts and keep track of the logged in users</li>
<li>offers the posibility to download this datastructure as a JSON file (didactic purpose)</li>
<li>handles the user registration, login and logout
Returns an object containing a series of functions - aka the API</li>
</ul>
</dd>
<dt><a href="#module_mainController">mainController</a></dt>
<dd><p>This is the main controller of the application. It is an IIFE function that acts like an API.
We use the other three controllers (received as parameters) to achive the desired app behaviour.
Returns an object containing the init() function.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#QuizController">QuizController</a></dt>
<dd><p>This is the Quiz Controller. It is an IIFE function that acts like an API.
It has the following functions :</p>
<ul>
<li>Loads the quiz questions for the type of quiz received.</li>
<li>Handles the quiz initialization and termination.</li>
<li>Checks if the answers received for each question are correct (one at a time).</li>
<li>Keeps track of the user&#39;s score in the current quiz.</li>
<li>Provides a data structure to save all the final scores of all users;
Returns an object containing a series of functions - aka the API</li>
</ul>
</dd>
<dt><a href="#UIController">UIController</a></dt>
<dd><p>This is the User Interface Controller. It is an IIFE function that acts like an API.
It has two functions :</p>
<ul>
<li>Handles/modifies the DOM.</li>
<li>Collects and returns the data introduced by the user.
Returns an object containing a series of functions - aka the API</li>
</ul>
</dd>
</dl>

<a name="module_AccountsController"></a>

## AccountsController
This is the Accounts Controller. It is an IIFE function that acts like an API.
It has the following functions :
 - provides a data structure to save the accounts and keep track of the logged in users
 - offers the posibility to download this datastructure as a JSON file (didactic purpose)
 - handles the user registration, login and logout
Returns an object containing a series of functions - aka the API


- [Modules](#modules)
- [Members](#members)
- [AccountsController](#accountscontroller)
  - [AccountsController.data](#accountscontrollerdata)
  - [AccountsController.loggedInAccount](#accountscontrollerloggedinaccount)
  - [AccountsController.Account()](#accountscontrolleraccount)
- [mainController](#maincontroller)
  - [mainController~init()](#maincontrollerinit)
- [QuizController](#quizcontroller)
- [UIController](#uicontroller)

<a name="module_AccountsController.data"></a>

### AccountsController.data
Mock database + loggedIn Accounts (to keep track of logged-in users)

**Kind**: static property of [<code>AccountsController</code>](#module_AccountsController)  
<a name="module_AccountsController.loggedInAccount"></a>

### AccountsController.loggedInAccount
Array to store the id and username of the currently logged in account

**Kind**: static property of [<code>AccountsController</code>](#module_AccountsController)  
<a name="module_AccountsController.Account"></a>

### AccountsController.Account()
data structure (constructor function) for accounts

**Kind**: static method of [<code>AccountsController</code>](#module_AccountsController)  
<a name="module_mainController"></a>

## mainController
This is the main controller of the application. It is an IIFE function that acts like an API.
We use the other three controllers (received as parameters) to achive the desired app behaviour.
Returns an object containing the init() function.


| Param | Type | Description |
| --- | --- | --- |
| QuizCtrl | <code>Object</code> | the QuizController |
| AccCtrl | <code>Object</code> | the AccountController |
| UICtrl | <code>Object</code> | the UIController |

<a name="module_mainController..init"></a>

### mainController~init()
The init funtion of the appplication. Calls setupEventListeners().

**Kind**: inner method of [<code>mainController</code>](#module_mainController)  
<a name="QuizController"></a>

## QuizController
This is the Quiz Controller. It is an IIFE function that acts like an API.
It has the following functions :
 - Loads the quiz questions for the type of quiz received.
 - Handles the quiz initialization and termination.
 - Checks if the answers received for each question are correct (one at a time).
 - Keeps track of the user's score in the current quiz.
 - Provides a data structure to save all the final scores of all users;
Returns an object containing a series of functions - aka the API

**Kind**: global variable  
<a name="UIController"></a>

## UIController
This is the User Interface Controller. It is an IIFE function that acts like an API.
It has two functions :
 - Handles/modifies the DOM.
 - Collects and returns the data introduced by the user.
Returns an object containing a series of functions - aka the API

**Kind**: global variable  
