// Fetch Data
import { fetchData } from './useFetch';
const THEME_BTN_SELECTOR = '#theme';
const APP_SELECTOR = '#app';
const HOME_BTN_SELECTOR = '#home';
const START_BTN_SELECTOR = '#start';
const themeBtn = document.querySelector(THEME_BTN_SELECTOR);
let data = [];

// Init element
const app = document.querySelector(APP_SELECTOR);
const homeBtn = document.querySelector(HOME_BTN_SELECTOR);
const startBtn = document.querySelector(START_BTN_SELECTOR);

fetchData().then(fetchedData => {
  data = [...fetchedData];
  startBtn.disabled = false;
  startBtn.textContent = 'Start';
}).catch(error => {
  console.error('Error fetching data:', error);
});

// Theme
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('darkMode');
});

// Game
startBtn.addEventListener('click', () => renderQuestions(0, 0));
homeBtn.addEventListener('click', home)

function renderQuestions(id, score) {
  app.innerHTML = `
    <hgroup>
      <p class="smallText">Question ${id + 1} of ${data.length}</p>
      <h3>${escapeHtml(data[id].question.text)}</h3>
      <div class="progress">
        <progress max="100" value="${((id + 1) / data.length) * 100}"></progress>
      </div>
    </hgroup>
    <ul class="questions">
      ${rdmQuestion(id)}
      <button id="submit" class="primaryButton">Submit Answer</button>
    </ul>
  `;

  const submitBtn = document.querySelector('#submit');

  submitBtn.addEventListener('click', () => checkAnswer(id, score, submitBtn));
}

function checkAnswer(id, score, submitBtn) {
  let newScore = score; 
  const questionsContainer = document.querySelector('.questions');
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  const correctAnswer = data[id].correctAnswer;

  if(!selectedAnswer) return alert('Please select an answer');

  questionsContainer.classList.add('answered');

  if (selectedAnswer.value.toLowerCase() === correctAnswer.toLowerCase()) {
    selectedAnswer.classList.add('correct');
    newScore++;
  } else {
    const correctAnswerElement = document.querySelector(`input[value="${escapeHtml(correctAnswer)}"]`);
    correctAnswerElement.classList.add('correctAnswer');
    selectedAnswer.classList.add('wrong');
  }

  submitBtn.textContent = 'Next Question';
  nextQuestion(id, newScore);
}

function nextQuestion(id, score) {
  const nextBtn = document.querySelector('#submit');

  nextBtn.addEventListener('click', () => {
    const newId = id < data.length - 1 ? id + 1 : id;
    if (newId !== id) {
      renderQuestions(newId, score);
    } else {
      app.innerHTML = `
        <hgroup>
          <h3 class="title">Quiz completed <span>You scored...</span></h3>
        </hgroup>
        <div class="score">
          <h5>${score}</h5>
          <p>out of ${data.length}</p>
        </div>
        <button id="playAgain" class="primaryButton">Play Again</button>
      `;

      const playAgainBtn = document.querySelector('#playAgain');

      playAgainBtn.addEventListener('click', () => renderQuestions(0, 0));
    }
  });
};

function rdmQuestion(id) {
  const answers = [data[id].correctAnswer, ...data[id].incorrectAnswers];

  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  let html = '';
  for (let i = 0; i < answers.length; i++) {
    html += `
      <li>
        <input type="radio" name="answer" value="${answers[i]}">
        <label for="answer${i}">
          <span>${String.fromCharCode(97 + i)}</span>
          <p>${escapeHtml(answers[i])}</p>
        </label>
      </li>
    `;
  }

  return html;
};

function home() {
  app.innerHTML = `
    <hgroup>
      <h1 class="title">
        Welcome to the <span>Frontend Quiz!</span>
      </h1>
      <p class="smallText">Pick a subject to get started.</p>
    </hgroup>
    <button id="start" class="primaryButton">Start</button>
  `
  // Game
  const homeBtn = document.querySelector('#home');
  const startBtn = document.querySelector('#start');
  startBtn.addEventListener('click', () => renderQuestions(0, 0));
  homeBtn.addEventListener('click', home)
}

function escapeHtml(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}