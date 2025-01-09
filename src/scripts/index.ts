const $textField = $('.wordlist');
const $inputField = $('#keyboard-input');

const typingMode = $('input[name="typing-mode"]:checked').val() as
  | 'timer'
  | 'wordCount';

let startTime: number;
let wordList: string[];
let currentWord: number;
let isTimerActive: boolean;
const correctWords: string[] = [];

currentWord = 0;
isTimerActive = false;

function setText(_lang: string) {
  wordList = [];
  const wordCount = 25;
  const lang = _lang.toLowerCase();
  fetch('/random.json')
    .then((response) => response.json())
    .then((data) => {
      const randomWords = data[lang];
      while (wordList.length < wordCount) {
        const randInx = Math.floor(Math.random() * randomWords.length);
        const randomWord = randomWords[randInx] || '';
        wordList.push(randomWord);
        $textField.append(`<span>${randomWord} </span>`);
      }
    })
    .catch((err) => console.error(err));
}

function startTimer() {
  switch (typingMode) {
    case 'timer':
      let seconds = 10;
      const timer = window.setInterval(() => {
        seconds--;
        if (seconds === 0) {
          window.clearInterval(timer);
          isTimerActive = false;
        }
      }, 1000);
      break;
    case 'wordCount':
      startTime = Date.now();
      break;
  }
}

function showResult() {
  let words, minute, acc;
  switch (typingMode) {
    case 'timer':
      words = correctWords.length;
      minute = 10 / 60;
      break;
    case 'wordCount':
      words = correctWords.length;
      minute = (Date.now() - startTime) / 1000 / 60;
      break;
  }
  acc = Math.floor((words / wordList.length) * 100);
  let wpm = Math.floor(words / minute);
  console.log(`WPM: ${wpm}`);
  console.log(`Accuracy: ${acc}%`);
}

$inputField.on('keydown', (e) => {
  if (currentWord === 0 && !isTimerActive && /^[a-zA-Z]$/.test(e.key)) {
    startTimer();
    isTimerActive = true;
  }
  if (e.key === ' ') {
    e.preventDefault();
    if ($inputField.val() !== '') {
      switch (typingMode) {
        case 'timer':
          if (!isTimerActive) {
            $inputField.prop('disabled', true);
            showResult();
            return;
          }
          const inputWord = $inputField.val();
          if (inputWord && inputWord === wordList[currentWord]) {
            correctWords.push(inputWord);
          }
          currentWord++;
          break;
        case 'wordCount':
          if (currentWord < wordList.length - 1) {
            const inputWord = $inputField.val();
            if (inputWord && inputWord === wordList[currentWord]) {
              correctWords.push(inputWord);
            }
            currentWord++;
          } else {
            $inputField.prop('disabled', true);
            showResult();
          }
          break;
      }
    }
    $inputField.val('');
  }
});

setText('english');
