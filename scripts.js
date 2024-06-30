let currentQuestionIndex = 0;
let answers = [];
let questions = [];
let cats = [];

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        loadQuestion();
    });

fetch('cats.json')
    .then(response => response.json())
    .then(data => {
        cats = data;
    });

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }
    const questionContainer = document.querySelector('.question');
    questionContainer.classList.add('question-enter');
    questionContainer.classList.remove('question-exit');

    setTimeout(() => {
        document.getElementById('question-title').innerText = `Question ${currentQuestionIndex + 1}`;
        document.getElementById('question-text').innerText = questions[currentQuestionIndex].text;
        document.getElementById('answer-slider').value = answers[currentQuestionIndex] !== undefined ? answers[currentQuestionIndex] : 2;
        document.getElementById('prev-button').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
        document.getElementById('next-button').innerText = currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit';

        // Adjust height of question container to ensure uniform size
        const maxHeight = Math.max(...Array.from(document.querySelectorAll('.question'), question => question.offsetHeight));
        questionContainer.style.height = `${maxHeight}px`;

        questionContainer.classList.remove('question-enter');
        questionContainer.classList.add('question-enter-active');
    }, 10); // Delay to allow the enter transition
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        saveAnswer();
        transitionQuestion(-1);
    }
}

function nextQuestion() {
    saveAnswer();
    if (currentQuestionIndex < questions.length - 1) {
        transitionQuestion(1);
    } else {
        showLoadingScreen(); // Add loading screen before showing result
        setTimeout(showResult, 2000); // Simulate loading with a timeout
    }
}

function saveAnswer() {
    const answer = document.getElementById('answer-slider').value;
    answers[currentQuestionIndex] = parseInt(answer, 10);
}

function transitionQuestion(direction) {
    const questionContainer = document.querySelector('.question');
    questionContainer.classList.add('question-exit');
    questionContainer.classList.remove('question-enter-active');

    setTimeout(() => {
        currentQuestionIndex += direction;
        loadQuestion();
    }, 500); // Match the transition duration
}

function showLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.classList.add('loading-screen');
    loadingScreen.innerHTML = '<video autoplay muted loop><source src="loading.mp4" type="video/mp4"></video>';
    document.body.appendChild(loadingScreen);
}

function showResult() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.remove(); // Remove loading screen if it exists
    }

    document.querySelector('.question').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';

    const resultCat = calculateCat();
    document.getElementById('catName').innerText = resultCat.name;
    document.getElementById('catDescription').innerText = resultCat.description;
    document.getElementById('catImage').src = resultCat.image.url;
    document.getElementById('catImage').style.height = 'auto'; // Ensure image height is auto for uniform size
    document.getElementById('catLink').href = resultCat.wikipedia_url;

    document.getElementById('catResult').style.display = 'block';
}

function calculateCat() {
    let highestMatch = Number.POSITIVE_INFINITY;
    let bestCat = null;
    cats.forEach(cat => {
        let matchScore = 0;
        matchScore += Math.abs(answers[0] - cat.social_needs);
        matchScore += Math.abs(answers[1] - cat.energy_level);
        matchScore += Math.abs(answers[2] - cat.intelligence);
        if (matchScore < highestMatch) {
            highestMatch = matchScore;
            bestCat = cat;
        }
    });
    return bestCat;
}
