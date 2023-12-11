// Load DOM fully before running the quiz
// Get the button elements and add event listeners

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function () {
            if (this.getAttribute("data-type") === "start") {
                checkUserName();
            } else if (this.getAttribute("data-type") === "next") {
                playNextQuestion();
            } else if (this.getAttribute("data-type") === "quit") {
                endGame();
            } else if (this.getAttribute("data-type") === "play-again") {
                playAgain();
            }
        });
    }

});

// Check that user name is entered
function checkUserName()

/**
 * Modal that shows as popup when user do not enter user name
 * Modal taken from https://www.w3schools.com/howto/howto_css_modals.asp
 */
function userNameModal() {}

// Initiate quiz
function startQuiz() {}

/**
 * Function to call questions in random order no matter if there are
 * new questions added or removed. 
 */
function shuffleQuizQuestions() {}

// Show questions
function showQuestion() {}

// Check selected answer;
function checkAnswer(event) {}

// Show next question
function playNextQuestion() {}

// Increment correct score
function incrementScore() {}

// Increment incorrect score
function incrementIncorrectScore() {}

// Reset score if player want to play again
function resetScore() {}

//Restart the game
function playAgain() {}

//End game if user want to quit beforhand or all questions are played
function endGame() {}