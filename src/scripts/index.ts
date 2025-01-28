import TypeQuest from './TypeQuest';

const $numInput = $('#numbers');
const $puncInput = $('#punctuation');
const $typingInput = $('#keyboard-input');
const $textFieldContainer = $('.text-field');
const $timerInput = $('input[name="timer"]');
const $wordCountInput = $('input[name="word-count"]');
const $typingModeInput = $('input[name="typing-mode"]');

function init() {
  const language = 'english';
  const wordCount = $wordCountInput.val() as number;
  const timerDuration = $timerInput.val() as number;
  const includeNumbers = $numInput.is(':checked') as boolean;
  const includePunctuation = $puncInput.is(':checked') as boolean;
  const typingMode = $('input[name="typing-mode"]:checked').val() as
    | 'timer'
    | 'wordCount';

  const tq = new TypeQuest(
    language,
    wordCount,
    timerDuration,
    includeNumbers,
    includePunctuation,
    typingMode,
  );

  tq.startGame($typingInput, $textFieldContainer);
}

[$numInput, $puncInput, $timerInput, $wordCountInput, $typingModeInput].forEach(
  ($input) => {
    $input.on('change', init);
  },
);

init();
