class Caret {
  private $caret: JQuery<HTMLElement>;
  private $currentWord!: JQuery<HTMLElement>;
  private $currentLetter!: JQuery<HTMLElement>;
  private position!: { top: number; left: number };

  constructor() {
    this.$caret = $('#caret');

    this.setCaretPosition = this.setCaretPosition.bind(this);
    this.moveCaretPosition = this.moveCaretPosition.bind(this);
  }

  setCaretPosition(currWordIndx: number, currLetterIndx: number) {
    this.$currentWord = $('span.word').eq(currWordIndx);
    this.$currentLetter = this.$currentWord
      .find('span.letter')
      .eq(currLetterIndx);
    this.position = this.$currentLetter.position();
    this.$caret.css({
      top: this.position.top,
      left: this.position.left,
    });
  }

  moveCaretPosition(currWordIndx: number, currLetterIndx: number) {
    this.$currentWord = $('span.word').eq(currWordIndx);
    this.$currentLetter = this.$currentWord
      .find('span.letter')
      .eq(currLetterIndx);
    this.position = this.$currentLetter.position();
    const width = this.$currentLetter.width() || 0;
    this.$caret.css({
      top: this.position.top,
      left: this.position.left + width,
      transition: 'top 0.2s ease, left 0.2s ease',
    });
  }

  removeCaretBlink() {
    this.$caret.css('animation', 'none');
  }

  setCaretStyle() {
    this.$caret.css({
      width: '0.1em',
      height: '2rem',
    });
  }
}

export default Caret;
