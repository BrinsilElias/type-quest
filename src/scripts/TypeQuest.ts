import Caret from './caret';
import { fmtTimeInterval } from './utility';

class TypeQuest {
  caret!: Caret;
  language: string;
  wordCount: number;
  timerDuration: number;
  includeNumbers: boolean;
  includePunctuation: boolean;
  typingMode: 'timer' | 'wordCount';

  private startTime: number;
  private typedWords: string[];
  private matchedWords: string[];
  private isTimerActive: boolean;
  private currentWordIndex: number;
  private currentLetterIndex: number;
  private generatedWords: string[];

  constructor(
    language: string,
    wordCount: number,
    timerDuration: number,
    includeNumbers: boolean,
    includePunctuation: boolean,
    typingMode: 'timer' | 'wordCount',
  ) {
    this.language = language;
    this.wordCount = wordCount;
    this.typingMode = typingMode;
    this.timerDuration = timerDuration;
    this.includeNumbers = includeNumbers;
    this.includePunctuation = includePunctuation;

    this.startTime = 0;
    this.typedWords = [];
    this.matchedWords = [];
    this.generatedWords = [];
    this.currentWordIndex = 0;
    this.currentLetterIndex = 0;
    this.isTimerActive = false;

    this.startGame = this.startGame.bind(this);
    this.addNumber = this.addNumber.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.fetchWordList = this.fetchWordList.bind(this);
    this.displayResults = this.displayResults.bind(this);
    this.addPunctuation = this.addPunctuation.bind(this);
  }

  private addPunctuation(word: string) {
    const punctuations = ['.', ',', '!', '?', ';', ':', '...'];
    if (Math.random() < 0.2) {
      const randomPunctuation =
        punctuations[Math.floor(Math.random() * punctuations.length)];
      return word + randomPunctuation;
    }
    return word;
  }

  private addNumber(word: string) {
    if (Math.random() < 0.1) {
      const randomNumber = Math.floor(Math.random() * 10);
      word = randomNumber.toString();
    }
    return word;
  }

  async fetchWordList($container: JQuery<HTMLElement>) {
    try {
      let randomWord: string;
      let randomWords: string[];
      const request = new Request('/random.json');
      const cacheName = 'word-list-cache';
      const cache = await caches.open(cacheName);
      const lang = this.language.toLowerCase();
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        randomWords = cachedData[lang];
      } else {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response.clone());
          const data = await response.json();
          randomWords = data[lang];
        }
        throw new Error('Failed to fetch word list from network');
      }
      if (this.typingMode === 'timer') {
        this.wordCount = 300;
      }
      $container.empty();
      while (this.generatedWords.length < this.wordCount) {
        const randomIndex = Math.floor(Math.random() * randomWords.length);
        randomWord = this.includePunctuation
          ? this.addPunctuation(randomWords[randomIndex] || '')
          : randomWords[randomIndex] || '';
        randomWord = this.includeNumbers
          ? this.addNumber(randomWord)
          : randomWord;
        this.generatedWords.push(randomWord);
        const wordSpan = $('<span class="word"></span>');
        [...randomWord].forEach((letter) => {
          wordSpan.append(`<span class="letter">${letter}</span>`);
        });
        $container.append(wordSpan).append(' ');
      }
      this.caret = new Caret();
      this.caret.setCaretPosition(
        this.currentWordIndex,
        this.currentLetterIndex,
      );
    } catch (error) {
      console.error(error);
    }
  }

  startTimer() {
    this.isTimerActive = true;
    switch (this.typingMode) {
      case 'timer':
        const $timerDisplay = $('time');
        let remainingSeconds = this.timerDuration;
        const timerId = window.setInterval(() => {
          remainingSeconds--;
          $timerDisplay
            .text(fmtTimeInterval(remainingSeconds, 'MM:SS'))
            .attr('datetime', fmtTimeInterval(remainingSeconds, 'Xm Ys'));
          if (remainingSeconds === 0) {
            window.clearInterval(timerId);
            this.isTimerActive = false;
            this.displayResults();
          }
        }, 1000);
        break;
      case 'wordCount':
        this.startTime = Date.now();
        break;
    }
  }

  displayResults() {
    let totalWordsTyped, minutesElapsed;
    switch (this.typingMode) {
      case 'timer':
        totalWordsTyped = this.matchedWords.length;
        minutesElapsed = this.timerDuration / 60;
        break;
      case 'wordCount':
        totalWordsTyped = this.matchedWords.length;
        minutesElapsed = (Date.now() - this.startTime) / 1000 / 60;
        break;
    }
    const accuracy = Math.floor(
      (totalWordsTyped / this.typedWords.length) * 100,
    );
    const wordsPerMinute = Math.floor(totalWordsTyped / minutesElapsed);
    console.log(`WPM: ${wordsPerMinute}`);
    console.log(`Accuracy: ${accuracy}%`);
  }

  startGame(
    $inputField: JQuery<HTMLElement>,
    $wordListContainer: JQuery<HTMLElement>,
  ) {
    this.fetchWordList($wordListContainer);
    $inputField.on('keydown', (event) => {
      if (
        this.currentWordIndex === 0 &&
        !this.isTimerActive &&
        /^[a-zA-Z]$/.test(event.key)
      ) {
        this.startTimer();
      }
      const $currWord = $('span.word').eq(this.currentWordIndex);
      const $currLetter = $currWord
        .find('span.letter')
        .eq(this.currentLetterIndex);
      if (
        event.key !== ' ' &&
        event.key !== 'Backspace' &&
        /^[a-zA-Z]$/.test(event.key)
      ) {
        const typedKey = event.key;
        const currentWord = this.generatedWords[this.currentWordIndex] || '';
        const currentLetter = currentWord[this.currentLetterIndex];
        if (typedKey === currentLetter) {
          $currLetter.addClass('correct');
        } else {
          $currLetter.addClass('incorrect');
        }
        this.caret.moveCaretPosition(
          this.currentWordIndex,
          this.currentLetterIndex,
        );
        this.currentLetterIndex++;
      }
      if (event.key === 'Backspace') {
        if (this.currentLetterIndex > 0) {
          this.currentLetterIndex--;
          this.caret.moveCaretPosition(
            this.currentWordIndex,
            this.currentLetterIndex,
            true,
          );
        }
      }
      if (event.key === ' ') {
        event.preventDefault();
        this.currentLetterIndex = 0;
        if ($inputField.val() !== '') {
          const typedWord = $inputField.val() || '';
          switch (this.typingMode) {
            case 'timer':
              if (!this.isTimerActive) {
                $inputField.prop('disabled', true);
                return;
              }
              if (typedWord === this.generatedWords[this.currentWordIndex]) {
                this.matchedWords.push(typedWord);
              }
              this.currentWordIndex++;
              break;
            case 'wordCount':
              if (this.currentWordIndex < this.generatedWords.length - 1) {
                if (typedWord === this.generatedWords[this.currentWordIndex]) {
                  this.matchedWords.push(typedWord);
                }
                this.currentWordIndex++;
              } else {
                $inputField.prop('disabled', true);
                this.displayResults();
              }
              break;
          }
          this.caret.setCaretPosition(
            this.currentWordIndex,
            this.currentLetterIndex,
          );
          $('span.word')
            .eq(this.currentWordIndex - 1)
            .addClass('typed');
          this.typedWords.push(
            this.generatedWords[this.currentWordIndex] || '',
          );
        }
        $inputField.val('');
      }
    });
  }
}

export default TypeQuest;
