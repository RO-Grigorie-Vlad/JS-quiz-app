## Objective

I created this app in order to practice **JS ES5**.

## Short description

- Users can use this app to take a quiz(multiple-choice) in order to test their knowledge about different programming languages.
- Currently, there are 3 quizes available, for Javascript, Java and Python.
- Before taking the quiz, the users have to register a new account and log in.

## System requirements

- Anyone can run this application on any OS, using any browser ().
- **A connection to the Internet is necessary** to load the Bootstrap 3 CSS.

## Instalation instructions

- Clone the repository.
- Check the contents of the src folder to make sure all the following files are present: 
    - `QuizController.js`
    - `AccountsController.js`
    - `UIController.js`
    - `mainController.js`
    - `quizApp.html`
    - `quizApp.css`
    - `questions.css` 
- That's it.
  
## Usage

- Open the `quizApp.html` file using any browser installed on your system.
- Register a new account by compleating the designated form.
- Login into the newly created account.
- Choose the desired quiz - the options right now are : Javascript, Java and Python.
- Click one ofthe 'Start quiz!' buttons to start the desired quiz. (The buttons will apear after login).
- Each question will apear individually. Choose what you think is the correct answer and submit your answer to proceed to the next question.
- Finish the quiz to see your score on the scoreboard. There is different scoreboard for each quiz.
- Abandoned quizes (when the user logs out during a quiz) are discarded.
- You can take any of the quizes however many times you want.
- Enjoy!

## Important note

- Since this is a JS-only application, the data (accounts created, scores on quizes etc.) lives as long as the page does. Therefor, **any page refresh will result in the data being lost and everything being RESETED**. Accounts created, quiz scores (etc.) will be lost.
- Can't make any promises that the Bootstrap 3 CSS will work for very old browsers.

## Future (possible) updates

- More quizes
- More questions for each quiz

## Contact

- Email : vlad_grigorie@yahoo.com
