// Fetch Data
import { fetchData } from './useFetch';
const themeBtn = document.querySelector('#theme');
let data = [];
let score = 0;

fetchData().then(fetchedData => {
  data = [...fetchedData];
});

// Init element
const app = document.querySelector('#app');
// HomePage
const startBtn = document.querySelector('#start');


// Theme
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('darkMode');
});


startBtn.addEventListener('click', start)

function start() {
  score = 0;
  renderQuestion(0);
}

function renderQuestion(id) {
  app.innerHTML = `
    <hgroup>
      <p class="smallText">Question ${id + 1} of ${data.length}</p>
      <h3>${data[id].question.text}</h3>
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

  submitBtn.addEventListener('click', checkAnswer);

  function checkAnswer() {
    const questionsContainer = document.querySelector('.questions');
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const correctAnswer = data[id].correctAnswer;

    questionsContainer.classList.add('answered');

    if (selectedAnswer.value.toLowerCase() === correctAnswer.toLowerCase()) {
      selectedAnswer.classList.add('correct');
      score++;
    } else {
      const correctAnswerElement = document.querySelector(`input[value="${correctAnswer}"]`);
      correctAnswerElement.classList.add('correctAnswer');
      selectedAnswer.classList.add('wrong');
    }

    submitBtn.textContent = 'Next Question';
    nextQuestion();
  }

  function nextQuestion() {
    const nextBtn = document.querySelector('#submit');

    nextBtn.addEventListener('click', () => {
      if (id < data.length - 1) {
        id++;
        renderQuestion(id);
      } else {
        app.innerHTML = `
          <hgroup>
            <h3 class="title">Quiz completed <span>You scored...</span></h3>
          </hgroup>
          <div class="score">
            <h5>${score / 2}</h5>
            <p>out of ${data.length}</p>
          </div>
          <button id="playAgain" class="primaryButton">Play Again</button>
        `;

        const playAgainBtn = document.querySelector('#playAgain');

        playAgainBtn.addEventListener('click', start);
      }
    });
  }

  function rdmQuestion() {
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
            <p>${answers[i]}</p>
          </label>
        </li>
      `;
    }

    return html;
  }
}