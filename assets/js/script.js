// Load DOM fully before running the quiz
// Get the button elements and add event listeners
// From Love Maths
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

// Get global variables;

const gameArea = document.getElementById("game-area");
const questionsArea = document.getElementById("questions-area");
const scoreArea = document.getElementById("score-area");
const resume = document.getElementById("resume");
const userNameLabel = document.getElementById("enter-name");
const displayQuestions = document.getElementById("questions");
const startingSeconds = 30;

let displayAnswerA = document.getElementById("answersA");
let displayAnswerB = document.getElementById("answersB");
let displayAnswerC = document.getElementById("answersC");
let showTimer = document.getElementById("timer");

let setTimer;
let numberOfQuestions = 0;
let questionIndex = 0;
let correctScore = 0;
let incorrectScore = 0;
let chosenAnswer = false;

// Array to enable/disable color to indicate correct/incorrect answer
const answerColor = [displayAnswerA, displayAnswerB, displayAnswerC];

// Add event listeners to answers buttons
displayAnswerA.addEventListener("click", checkAnswer);
displayAnswerB.addEventListener("click", checkAnswer);
displayAnswerC.addEventListener("click", checkAnswer);

/**
 * Show a popup window (Modal) with instructions when the Instructions button is clicked.
 * Modal taken from https://www.w3schools.com/howto/howto_css_modals.asp
 */
let instructionsPopup = document.getElementById("instructions-modal");
const instructionsButton = document.getElementById("instructions");
let span = document.getElementsByClassName("close")[0];
instructionsButton.onclick = function () {
    instructionsPopup.style.display = "block";
};
// Close modal
span.onclick = function () {
    instructionsPopup.style.display = "none";
};

// Check that user name is entered
function checkUserName() {
    const userName = userNameLabel.value.trim();

    if (userName === "") {
        userNameModal();
    } else {
        startQuiz();
    }
}

/**
 * Modal that shows as popup when user do not enter user name
 * Modal taken from https://www.w3schools.com/howto/howto_css_modals.asp
 */
function userNameModal() {
    let userNamePopup = document.getElementById("alert-name-input-area");
    userNamePopup.style.display = "block";

    // Close modal
    let okButton = document.getElementById("ok");
    okButton.addEventListener("click", function () {
        userNamePopup.style.display = "none";
    });
}

// Initiate quiz
function startQuiz() {
    //Reset user name
    userNameLabel.value = "";

    //Reset timer
    clearInterval(setTimer);
    
    gameArea.classList.remove("visible");
    gameArea.classList.add("hide");
    questionsArea.classList.remove("hide");
    questionsArea.classList.add("visible");
    scoreArea.classList.remove("hide");
    scoreArea.classList.add("visible");

    // Get shuffled question
    let newQuestion = shuffleQuizQuestions();

    // Set the current question to shuffled question
    quizQuestions[questionIndex] = newQuestion;

    showQuestion();
}

/**
 * Function to call questions in random order no matter if there are
 * new questions added or removed. 
 */
function shuffleQuizQuestions() {
    let randomQuestions = Math.floor(Math.random() * quizQuestions.length);
    let shuffledQuestion = Object.assign({}, quizQuestions[randomQuestions]);

    // Get the corresponding answers
    let randomAnswers = Object.keys(shuffledQuestion.answers);
    randomAnswers = randomAnswers.sort(() => Math.random() - 0.5);
    let shuffledAnswers = {};
    for (let key of randomAnswers) {
        shuffledAnswers[key] = shuffledQuestion.answers[key];
    }
    shuffledQuestion.answers = shuffledAnswers;

    return shuffledQuestion;
}

// Show questions
function showQuestion() {
    const currentQuestion = quizQuestions[questionIndex];
    displayQuestions.innerText = currentQuestion.question;

    // Return the correlating answers
    displayAnswerA.innerText = `a. ${currentQuestion.answers.a}`;
    displayAnswerB.innerText = `b. ${currentQuestion.answers.b}`;
    displayAnswerC.innerText = `c. ${currentQuestion.answers.c}`;

    displayTimer();

    resetBackgroundColor();

    // Let user play 10 questions
    numberOfQuestions++;
    if (numberOfQuestions === 11) {
        endGame();
    }
}

// Set a timer to each questions of 30 seconds
function displayTimer() {
    let timer = startingSeconds;
    setTimer = setInterval(() => {
        showTimer.innerText = `${timer}`;

        if(timer === 0) {
            clearInterval(setTimer);
            
            timesUp();
            numberOfQuestions = 0;
        }

        timer--;

        // Stop timer when the question has been answered
        if(chosenAnswer) {
            clearInterval(setTimer);
            chosenAnswer = false;
            showQuestion();
            return;
        }
      
    }, 1000);

}

/**
 * Modal that shows as popup when time is up
 * Modal taken from https://www.w3schools.com/howto/howto_css_modals.asp
 */
function timesUp() {
    let timeIsUp = document.getElementById("times-up-modal");
    timeIsUp.style.display = "block";

    // Close modal and end game
    let timesUpOk = document.getElementById("times-up-ok");
    timesUpOk.addEventListener("click", function () {
            timeIsUp.style.display = "none";

            // Delay endGame call to show modal
            setTimeout(function () {
                endGame();
            }, 100);
        });
        
}

// Check selected answer;
function checkAnswer(event) {
    const selectedAnswer = event.target.dataset.type;
    const correctAnswer = quizQuestions[questionIndex].correctAnswer;


    // Color correct answer green, incorrect red
    if (selectedAnswer === correctAnswer) {
        event.target.style.backgroundColor = "green";
        incrementScore();
    } else {
        revealCorrectAnswer();
        event.target.style.backgroundColor = "red";
        incrementIncorrectScore();
    }
    
    disableClickAnswers();

    chosenAnswer = true;

    clearInterval(setTimer);
}

// Show next question
function playNextQuestion() {
   
    // Check if there are questions left
    if (questionIndex < quizQuestions.length - 1 && chosenAnswer) {

        // Increment the question index
        questionIndex++;

        showQuestion();
        chosenAnswer = false;
    } else {
        if (questionIndex === quizQuestions.length - 1) {
            endGame();
            // Alert if no question is clicked    
        } else {
            selectAnswerModal();
        }
    }
}

/**
 * Modal that shows as popup when user do not select an answer
 * Modal taken from https://www.w3schools.com/howto/howto_css_modals.asp
 */
function selectAnswerModal() {
    let answerPopup = document.getElementById("select-answer-modal");
    answerPopup.style.display = "block";

    // Close modal
    let okAnswerButton = document.getElementById("answer-ok");
    okAnswerButton.addEventListener("click", function () {
        answerPopup.style.display = "none";
    });

}

// Reset color and add event listener
function resetBackgroundColor() {
    answerColor.forEach(answer => {
        answer.style.backgroundColor = "";
        answer.addEventListener("click", checkAnswer);
        answer.style.pointerEvents = 'auto';
    });
}

// Remove event listener when answer is chosen
function disableClickAnswers() {
    answerColor.forEach(answer => {
        answer.removeEventListener("click", checkAnswer);
        answer.style.pointerEvents = 'none';
    });

}

// Show correct answer in color green when answered incorrect
function revealCorrectAnswer() {
    const correctAnswerElement = getAnswerElementByType(quizQuestions[questionIndex].correctAnswer);
    if (correctAnswerElement) {
        correctAnswerElement.style.backgroundColor = "green";
    }

}

function getAnswerElementByType(type) {
    return answerColor.find(answer => answer.dataset.type === type);
}

// Increment correct score, from Love Maths
function incrementScore() {
    let oldScore = parseInt(document.getElementById("correctscore").innerText);
    document.getElementById("correctscore").innerText = ++oldScore;
}

// Increment incorrect score, from Love Mats
function incrementIncorrectScore() {
    let oldScore = parseInt(document.getElementById("incorrectscore").innerText);
    document.getElementById("incorrectscore").innerText = ++oldScore;
}

// Reset score if player want to play again
function resetScore() {
    correctScore = 0;
    incorrectScore = 0;
    document.getElementById("correctscore").innerText = "0";
    document.getElementById("incorrectscore").innerText = "0";
}

//Restart the game
function playAgain() {
    resetScore();

    numberOfQuestions = 0;

    clearInterval(setTimer);

    resume.classList.add("hide");
    resume.classList.remove("visible");
    gameArea.classList.add("visible");
    gameArea.classList.remove("hide");
}

//End game if user want to quit beforehand or all questions are played
function endGame() {
    numberOfQuestions = 0;
    questionIndex = 0;

    clearInterval(setTimer);

    questionsArea.classList.remove("visible");
    questionsArea.classList.add("hide");
    resume.classList.remove("hide");
    resume.classList.add("visible");
}