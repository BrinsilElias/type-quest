import TypeQuest from './TypeQuest';

const $typingInput = $('#keyboard-input');
const $textFieldContainer = $('.text-field');

const language = 'english';
const includeNumbers = $('#numbers').is(':checked');
const includePunctuation = $('#punctuation').is(':checked');
const wordCount = $('input[name="word-count"]').val() as number;
const timerDuration = $('input[name="timer-countdown"]').val() as number;
const typingMode = $('input[name="typing-mode"]:checked').val() as
  | 'timer'
  | 'wordCount';

function init() {
  const tq = new TypeQuest(
    language,
    wordCount,
    timerDuration,
    includeNumbers,
    includePunctuation,
    typingMode
  );

  tq.startGame($typingInput, $textFieldContainer);
}

init();
