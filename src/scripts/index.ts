import $ from 'jquery';

declare global {
  interface Window {
    $: typeof $;
  }
}

window.$ = $;

const $textField = $('.wordlist');
const $inputField = $('#keyboard-input');

let timer: number;
let startTime: number;
let wordList: string[];
let currentWord: number;
let isTimerActive: boolean;
const correctWords: string[] = [];

currentWord = 0;
isTimerActive = false;
const testMode = $('input.test-mode:checked').val() as 'timer' | 'wordCount';

function getWordList() {
  const quote = Math.floor(Math.random() * (30 - 0 + 1)) + 1;
  fetch(`https://dummyjson.com/quotes/${quote}`)
    .then((response) => response.json())
    .then((data) => {
      $textField.text(data.quote);
      wordList = data.quote.split(' ');
    });
}

function startTimer() {
  switch (testMode) {
    case 'timer':
      // Start a timer of specified time
      return 0;
    case 'wordCount': {
      startTime = 0;
      const timerId = window.setInterval(() => {
        startTime++;
      }, 1000);
      return timerId;
    }
  }
}

$inputField.on('keydown', (e) => {
  if (currentWord === 0 && !isTimerActive && /^[a-zA-Z]$/.test(e.key)) {
    timer = startTimer();
    isTimerActive = true;
  }
  if (e.key === ' ') {
    e.preventDefault();

    if ($inputField.val() !== '') {
      if (currentWord < wordList.length - 1) {
        const inputWord = $inputField.val();
        if (inputWord && inputWord === wordList[currentWord]) {
          correctWords.push(inputWord);
        }
        currentWord++;
      } else {
        window.clearInterval(timer);
        console.log(startTime);
        console.log(correctWords);
        $inputField.prop('disabled', true);
      }
    }

    $inputField.val('');
  }
});

getWordList();
