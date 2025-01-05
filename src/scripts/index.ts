import $ from 'jquery';

declare global {
  interface Window {
    $: typeof $;
  }
}

window.$ = $;

const $textField = $('.wordlist');
const $inputField = $('#keyboard-input');

let time: number;
let timer: number;
let wordList: string[];

let currentWord = 0;
let isTimerActive = false;
const typingMode = 'timer';

function getWordList() {
  const post = Math.floor(Math.random() * (251 - 0 + 1)) + 1;
  fetch(`https://dummyjson.com/posts/${post}`)
    .then((response) => response.json())
    .then((data) => {
      $textField.text(data.body);
      wordList = data.body.split(' ');
    });
}

function startTimer(seconds: number) {
  time = seconds;
  timer = window.setInterval(() => {
    time--;
    if (seconds === 0) {
      clearInterval(timer);
    }
    console.log(time);
  }, 1000);
}

$inputField.on('keydown', (e) => {
  if (currentWord === 0 && !isTimerActive && /^[a-zA-Z]$/.test(e.key)) {
    startTimer(60);
    isTimerActive = true;
  }
  if (e.key === ' ') {
    e.preventDefault();

    if ($inputField.val() !== '') {
      if (currentWord < wordList.length - 1) {
        const inputWord = $inputField.val();
        if (inputWord === wordList[currentWord]) {
          console.log(inputWord);
        }
        $inputField.val('');
        currentWord++;
      }
    }
  }
});

getWordList();
