
let countSpan = document.querySelector('.quiz-count span');
let bullets = document.querySelector('.bullets');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let resultsContainer = document.querySelector('.results');
let countDownElement = document.querySelector('.count-down')

// Current index of the question
let currentIndex = 0;
let correctAnswers = 0;  // Ensure this is defined globally
let countdowninterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;

            // Create bullets + set questions count
            createBullets(qCount);
            // start countdown
            countDown(5,qCount);
            // Add question data
            addQuestionData(questionsObject[currentIndex], qCount);
            // Click on Submit
            submitButton.onclick = function() {
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                // Check The Answer
                checkAnswer(theRightAnswer);
                // Increase index
                currentIndex++;
                // Remove previous question
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';
                // Add Question Data
                if (currentIndex < qCount) {
                    addQuestionData(questionsObject[currentIndex], qCount);
                    // Handle bullets
                    handleBullets();
                    // start countdown
                    clearInterval(countdowninterval)
                    countDown(5,qCount);
                } else {
                    // Show results
                    showResults(qCount);
                }
            }
        }
    };

    myRequest.open("GET", "Questions.json", true);
    myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    // Create spans
    for (let i = 0; i < num; i++) {
        // Create span
        let theBullet = document.createElement('span');
        if (i === 0) {
            theBullet.className = "on";
        }
        // Append bullets to main bullets container
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // Create h2 question title
        let questionTitle = document.createElement('h2');
        // Create question text
        let questionText = document.createTextNode(obj.title);
        // Append text to h2
        questionTitle.appendChild(questionText);
        // Append question to quiz area
        quizArea.appendChild(questionTitle);

        // Create answers
        for (let i = 1; i <= 3; i++) {
            let mainDiv = document.createElement('div');
            mainDiv.className = 'answer';

            let radioInput = document.createElement('input');
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer${i}`];

            // Create label
            let theLabel = document.createElement('label');
            theLabel.htmlFor = `answer_${i}`;

            let theLabelText = document.createTextNode(obj[`answer${i}`]);
            theLabel.appendChild(theLabelText);

            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer) {
    let answers = document.getElementsByName('question');
    let theChosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChosenAnswer) {
        correctAnswers++;
        console.log('Correct Answer');
    }
}

function handleBullets() {
    let bulletsSpan = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpans = Array.from(bulletsSpan);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (correctAnswers > count / 2 && correctAnswers < count) {
            theResults = `<span class="good">Good</span>, ${correctAnswers} from ${count} is Good`;
        } else if (correctAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Are Correct`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${correctAnswers} from ${count}`;
        }

        resultsContainer.innerHTML = theResults;
    }
}
function countDown (duration,count){
    if(currentIndex<count){
        let minutes,seconds;
        countdowninterval= setInterval(function() {
            minutes =parseInt(duration / 60);
            seconds =parseInt(duration % 60);

            minutes = minutes < 10 ? `0 ${minutes}`: minutes ;
            seconds = seconds < 10 ? `0 ${seconds}`: seconds ;

            countDownElement.innerHTML=`${minutes}:${seconds}`;

            if(--duration<0){
                clearInterval(countdowninterval);
                submitButton.click();
            }
        },1000)

    }
}
    



