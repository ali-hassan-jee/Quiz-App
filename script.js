const quizData = [
    {
        question: "Inside which HTML element do we put the JavaScript?",
        answers: ["<js>", "<scripting>", "<script>", "<javascript>"],
        correctAnswerIndex: 2
    },
    {
        question: "What does the typeof operator do?",
        answers: ["Returns the type of a variable", "Defines a variable", "Converts a variable to a string", "Returns the value of a variable"],
        correctAnswerIndex: 0
    },
    {
        question: "Which of the following is not a primitive data type in JavaScript?",
        answers: ["String", "Number", "Object", "Boolean"],
        correctAnswerIndex: 2
    },
    {
        question: "Which company developed JavaScript?",
        answers: ["Netscape", "Sun Microsystems", "Google", "Microsoft"],
        correctAnswerIndex: 0
    },
    {
        question: "Which symbol is used for single-line comments in JavaScript?",
        answers: ["//", "/*", "#", "<!--"],
        correctAnswerIndex: 0
    },
    {
        question: "How do you create a function in JavaScript?",
        answers: ["function = myFunction()", "function myFunction()", "create function myFunction()", "function: myFunction()"],
        correctAnswerIndex: 1
    },
    {
        question: "What is the output of console.log(2 + '2')?",
        answers: ["4", "22", "Error", "NaN"],
        correctAnswerIndex: 1
    },
    {
        question: "Which method is used to remove the last element from an array?",
        answers: ["pop()", "shift()", "remove()", "delete()"],
        correctAnswerIndex: 0
    },
    {
        question: "How do you declare a variable in JavaScript?",
        answers: ["var x;", "int x;", "declare x;", "let x;"],
        correctAnswerIndex: 0
    },
    {
        question: "What is the default value of an uninitialized variable in JavaScript?",
        answers: ["undefined", "null", "0", "NaN"],
        correctAnswerIndex: 0
    },
    {
        question: "Which method is used to combine two or more arrays in JavaScript?",
        answers: ["concat()", "merge()", "join()", "combine()"],
        correctAnswerIndex: 0
    },
    {
        question: "How can you check if a variable x is an array in JavaScript?",
        answers: ["Array.isArray(x)", "typeof x == 'array'", "x instanceof Array", "Both 1 and 3"],
        correctAnswerIndex: 3
    },
    {
        question: "Which of the following is used to store data in a web browser permanently?",
        answers: ["Cookies", "localStorage", "sessionStorage", "All of the above"],
        correctAnswerIndex: 1
    },
    {
        question: "What does NaN stand for in JavaScript?",
        answers: ["Not a Number", "Not an Object", "Not a Null", "None of the above"],
        correctAnswerIndex: 0
    },
    {
        question: "What does the splice() method do?",
        answers: ["Adds or removes items from an array", "Sorts an array", "Reverses an array", "Changes the length of an array"],
        correctAnswerIndex: 0
    },
    {
        question: "Which event occurs when the user clicks on an HTML element?",
        answers: ["onclick", "onload", "onmouseover", "onchange"],
        correctAnswerIndex: 0
    },
    {
        question: "What does the map() method do in JavaScript?",
        answers: ["Applies a function to each item in an array and returns a new array", "Returns the first item in an array", "Reverses an array", "Finds a value in an array"],
        correctAnswerIndex: 0
    },
    {
        question: "Which of the following is a correct way to write a JavaScript array?",
        answers: ["var arr = (1, 2, 3)", "var arr = [1, 2, 3]", "var arr = {1, 2, 3}", "var arr = <1, 2, 3>"],
        correctAnswerIndex: 1
    },
    {
        question: "What is the purpose of JSON.stringify()?",
        answers: ["Converts a JavaScript object to a JSON string", "Parses a JSON string into a JavaScript object", "Converts a JavaScript function into a string", "None of the above"],
        correctAnswerIndex: 0
    }
];

let data = {
    'QuestionIndex': null,
    'Score': 0,
    'TimeRemaining': 30,
    'IsAnswered': false,
    'QuizStarted': false,
    'SelectedOptionIndex': null,
    'QuizFinished': false,
    'AnsweredQuestions': {},
    'EndTime': null
};
const StartButton = document.querySelector('.start-button');
const StartScreen = document.querySelector('.start-screen');
const QuizScreen = document.querySelector('.quiz-screen');
const showTimer = document.querySelector('.quiz-timer p span');
const Main = document.querySelector('.main');
const quizQuestion = document.querySelector('.quiz-question p');
const options = [...document.querySelectorAll('.answer')];
const quizCounter = document.querySelector('.quiz-question-counter span');
const Next = document.querySelector('.next');
const ScoreMsg = document.querySelector('.score');

let savedData;
let Score = 0;
let ind = -1;
let intervalId = null;
document.addEventListener('DOMContentLoaded', function() {
    // Initialize or load saved data
    if (!localStorage.getItem("Data")) {
        localStorage.setItem("Data", JSON.stringify(data));
    }
    savedData = JSON.parse(localStorage.getItem("Data")) || data;
    Score = savedData.Score || 0;

    // Set total questions display
    const totalQuestionsEl = document.querySelector('.total-questions');
    if (totalQuestionsEl) {
        totalQuestionsEl.textContent = quizData.length;
    }

    // Restore UI state if quiz was started
    if (savedData.QuizStarted) {
        ind = savedData.QuestionIndex || 0;
        
        // Load the current question
        if (quizQuestion && quizData[ind]) {
            quizQuestion.textContent = quizData[ind].question;
        }
        
        // Restore the visual state
        restoreQuestionState(ind);
        
        // Show the quiz screen
        Screens();
        
        // If not finished, load the questions
        if (!savedData.QuizFinished) {
            loadQuestions();
        }
    }
    
    // If quiz was finished, show final score
    if (savedData.QuizFinished) {
        showFinalScore();
    }

    // Event listeners
    if (StartButton) StartButton.addEventListener('click', startQuiz);
    
    options.forEach((option, index) => {
        if (option) option.addEventListener('click', (e) => handleAnswer(e, index));
    });
    
    if (Next) Next.addEventListener('click', nextQuestion);
    
    const resetButton = document.querySelector('.reset-button');
    if (resetButton) resetButton.addEventListener('click', resetQuiz);
 if (savedData.QuizStarted && savedData.QuestionIndex !== null) {
        restoreQuestionState(savedData.QuestionIndex);
    }

    
});


function restoreQuestionState(questionIndex) {
    // Ensure we have valid data
    if (questionIndex === null || questionIndex === undefined || !quizData[questionIndex]) return;

    const correctIndex = quizData[questionIndex].correctAnswerIndex;
    const selectedIndex = savedData.SelectedOptionIndex;
    
    // First update all answer texts
    options.forEach((option, index) => {
        if (option) {
            const answerText = option.querySelector('.answer-text');
            if (answerText) {
                answerText.textContent = quizData[questionIndex].answers[index];
            }
        }
    });

    // Check if this question was answered
    const wasAnswered = savedData.AnsweredQuestions.hasOwnProperty(questionIndex);
    
    if (wasAnswered) {
        // Always mark the correct answer
        if (options[correctIndex]) {
            options[correctIndex].classList.add('right-border');
            const correctIcon = options[correctIndex].querySelector('.correct-icon');
            if (correctIcon) {
                correctIcon.innerHTML = '<img src="./images/correct.png" alt="Correct Answer">';
            }
        }
        
        // Mark selected answer if it was wrong
        if (selectedIndex !== null && selectedIndex !== undefined && selectedIndex !== correctIndex) {
            if (options[selectedIndex]) {
                options[selectedIndex].classList.add('wrong-border');
                const chosenAnswer = options[selectedIndex].querySelector('.chosen-answer');
                if (chosenAnswer) {
                    chosenAnswer.innerHTML = '<span>You Choose</span><img src="./images/wrong.png" alt="">';
                }
            }
        }
        
        // Mark selected answer if it was correct
        if (selectedIndex !== null && selectedIndex !== undefined && selectedIndex === correctIndex) {
            if (options[selectedIndex]) {
                const chosenAnswer = options[selectedIndex].querySelector('.chosen-answer');
                if (chosenAnswer) {
                    chosenAnswer.innerHTML = '<span>You Choose</span><img src="./images/correct.png" alt="">';
                }
            }
        }
        
        // Disable all options if question was answered
        options.forEach(opt => {
            if (opt) opt.style.pointerEvents = 'none';
        });
    } else {
        // If not answered, just show the options
        options.forEach(opt => {
            if (opt) opt.style.pointerEvents = 'auto';
        });
    }
}


function startQuiz() {
    // Reset all data
    data = {
        'QuestionIndex': 0,
        'Score': 0,
        'TimeRemaining': 30,
        'IsAnswered': false,
        'QuizStarted': true,
        'SelectedOptionIndex': null,
        'QuizFinished': false,
        'AnsweredQuestions': {},
        'EndTime': Date.now() + 30000
    };
    
    updateLocalStorage(data);
    Score = 0;
    ind = 0;
    Screens();
    loadQuestions();
}

function loadQuestions() {
    // Ensure we have the latest saved data
    savedData = JSON.parse(localStorage.getItem("Data")) || data;
    
    // Clear any existing timers
    clearInterval(intervalId);
    RemoveAlert15();
    RemoveAlert5();

    // Reset UI elements
    
    resetBorders();
    
    // Update question counter
    if (quizCounter) {
        quizCounter.textContent = (ind + 1).toString();
    }
    
    // Set current question text
    if (quizQuestion && quizData[ind]) {
        quizQuestion.textContent = quizData[ind].question;
    }
    
    // Update answer options
    options.forEach((option, index) => {
        if (option && quizData[ind] && quizData[ind].answers[index]) {
            const answerText = option.querySelector('.answer-text');
            if (answerText) {
                answerText.textContent = quizData[ind].answers[index];
            }
            option.style.pointerEvents = 'auto';
            
            // Clear previous answer markers
            const chosenAnswer = option.querySelector('.chosen-answer');
            const correctIcon = option.querySelector('.correct-icon');
            if (chosenAnswer) chosenAnswer.innerHTML = '';
            if (correctIcon) correctIcon.innerHTML = '';
        }
    });

    // Initialize timer
    let endTime = savedData.EndTime || Date.now() + 30000;
    let timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    
    // Display initial time
    if (showTimer) {
        showTimer.textContent = timeLeft.toString().padStart(2, '0');
    }

    // Start countdown interval
    intervalId = setInterval(() => {
        const now = Date.now();
        timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
        
        // Update display
        if (showTimer) showTimer.textContent = timeLeft.toString().padStart(2, '0');
        
        // Handle alerts
        if (timeLeft <= 5 && !Main.classList.contains('main-alert')) {
            AddAlert5();
        } else if (timeLeft <= 15 && !Main.classList.contains('alert5')) {
            AddAlert15();
        }
        
        // Handle expiration
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            handleTimeExpired();
        }
    }, 200);
}
function handleTimeExpired() {
    // Save answer if selected but time ran out
    if (savedData.SelectedOptionIndex !== null && !savedData.IsAnswered) {
        const correctIndex = quizData[ind].correctAnswerIndex;
        if (savedData.SelectedOptionIndex === correctIndex) {
            Score++;
            savedData.Score = Score;
        }
        savedData.IsAnswered = true;
        savedData.AnsweredQuestions[ind] = savedData.SelectedOptionIndex;
        updateLocalStorage(savedData);
    }
    
    // Move to next question
    moveToNextQuestion();
}

function handleAnswer(e, selectedIndex) {
    savedData = JSON.parse(localStorage.getItem("Data")) || data;
    const correctIndex = quizData[ind].correctAnswerIndex;
    
    // Update saved data
    savedData.SelectedOptionIndex = selectedIndex;
    savedData.IsAnswered = true;
    savedData.AnsweredQuestions[ind] = selectedIndex;
    
    // Mark UI
    const clickedOption = e.currentTarget;
    const chosenAnswer = clickedOption.querySelector('.chosen-answer');
    
    if (selectedIndex === correctIndex) {
        Score++;
        savedData.Score = Score;
        clickedOption.classList.add('right-border');
        
        // Update correct icon and "You Choose" text
        if (chosenAnswer) {
            chosenAnswer.innerHTML = '<span>You Choose</span><img src="./images/correct.png" alt="Correct">';
        }
    } else {
        clickedOption.classList.add('wrong-border');
        
        // Update wrong answer display
        if (chosenAnswer) {
            chosenAnswer.innerHTML = '<span>You Choose</span><img src="./images/wrong.png" alt="Wrong">';
        }
        
        // Show correct answer
        const correctOption = options[correctIndex];
        if (correctOption) {
            correctOption.classList.add('right-border');
            const correctIcon = correctOption.querySelector('.correct-icon');
            if (correctIcon) {
                correctIcon.innerHTML = '<img src="./images/correct.png" alt="Correct Answer">';
            }
        }
    }
    
    // Disable all options
    options.forEach(opt => {
        if (opt) {
            opt.style.pointerEvents = 'none';
        }
    });
    
    updateLocalStorage(savedData);
}
function nextQuestion() {
    clearInterval(intervalId);
    moveToNextQuestion();
}

function endQuiz() {
    clearInterval(intervalId);
    
    if (ScoreMsg) {
        ScoreMsg.classList.remove('show-score');
        const scoreSpan = ScoreMsg.querySelector('span');
        if (scoreSpan) {
            scoreSpan.textContent = Score.toString();
        }
    }
    
    savedData.QuizStarted = false;
    savedData.QuizFinished = true;
    updateLocalStorage(savedData);
    
    if (StartScreen) StartScreen.classList.remove('show-start-screen');
    if (QuizScreen) QuizScreen.classList.add('show-quiz-screen');
    if (StartButton) StartButton.textContent = "Restart Quiz";
}

function showFinalScore() {
    // Ensure we have the latest score
    savedData = JSON.parse(localStorage.getItem("Data")) || data;
    
    if (ScoreMsg) {
        const scoreSpan = ScoreMsg.querySelector('span');
        if (scoreSpan) {
            scoreSpan.textContent = savedData.Score.toString();
        }
        ScoreMsg.classList.add('show-score');
    }
    
    if (StartButton) StartButton.textContent = "Restart Quiz";
}
// KEEP ALL THESE UTILITY FUNCTIONS EXACTLY AS THEY ARE:
function resetBorders() {
    options.forEach((option) => {
        if (option) {
            option.classList.remove('right-border', 'wrong-border');
            const chosenAnswer = option.querySelector('.chosen-answer');
            const correctIcon = option.querySelector('.correct-icon');
            if (chosenAnswer) chosenAnswer.innerHTML = '';
            if (correctIcon) correctIcon.innerHTML = '';
            option.style.pointerEvents = 'auto';
        }
    });
}

function updateLocalStorage(data) {
    localStorage.setItem("Data", JSON.stringify(data));
}

function AddAlert5() {
    showTimer.parentElement.parentElement.classList.add('redalert');
    Main.classList.add('main-alert');
}

function RemoveAlert5() {
    showTimer.parentElement.parentElement.classList.remove('redalert');
    Main.classList.remove('main-alert');
}

function AddAlert15() {
    showTimer.parentElement.parentElement.classList.add('greenalert');
    Main.classList.add('alert5');
}

function RemoveAlert15() {
    showTimer.parentElement.parentElement.classList.remove('greenalert');
    Main.classList.remove('alert5');
}

function Screens() {
    StartScreen.classList.toggle('show-start-screen');
    QuizScreen.classList.toggle('show-quiz-screen');
}

function resetQuiz() {


if (confirm('Are you sure you want to reset the quiz? All progress will be lost.')) {


    // Clear localStorage
    localStorage.removeItem("Data");

    // Reset global variables
    data = {
        'QuestionIndex': null,
        'Score': 0,
        'TimeRemaining': 30,
        'IsAnswered': false,
        'QuizStarted': false,
        'SelectedOptionIndex': null,
        'QuizFinished': false,
        'AnsweredQuestions': {},
        'EndTime': null
    };
    savedData = data;
    Score = 0;
    ind = -1;
    clearInterval(intervalId);

    // Reset UI
    // Hide quiz screen, show start screen
    // QuizScreen.style.display = 'none';
    // StartScreen.style.display = 'block';
    StartScreen.classList.add('show-start-screen');
    QuizScreen.classList.remove('show-quiz-screen');
    location.reload()

}
}


function moveToNextQuestion() {
    // Clear existing timer
    clearInterval(intervalId);
    
    // Move to next question
    ind++;
    
    if (ind >= quizData.length) {
        endQuiz();
    } else {
        // Reset question state
        savedData.QuestionIndex = ind;
        savedData.IsAnswered = false;
        savedData.SelectedOptionIndex = null;
        savedData.EndTime = Date.now() + 30000;
        
        // Update storage and UI
        updateLocalStorage(savedData);
        resetBorders();
        loadQuestions();
    }
}
const bgMusic = document.getElementById("bg-music");
const volumeIcon = document.getElementById("volume-icon");

// Set initial state
bgMusic.volume = 0.5;
bgMusic.muted = true;
volumeIcon.src = "./images/muted.svg";

// Play only after user interaction
document.addEventListener("click", () => {
  bgMusic.play().then(() => {
    console.log("Music is playing!");
  }).catch(err => {
    console.error("Autoplay blocked or error:", err);
  });
}, { once: true });
// Toggle mute/unmute
volumeIcon.addEventListener("click", () => {
  bgMusic.muted = !bgMusic.muted;

  if (bgMusic.muted) {
    volumeIcon.src = "./images/muted.svg";
  } else {
    volumeIcon.src = "./images/volume.svg";
  }
});
document.querySelector(".start-button").addEventListener("click", () => {
  bgMusic.play().catch(err => console.log("Still blocked:", err));
});
