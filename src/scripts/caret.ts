class Caret {
  private lineHeight: number;
  private $caret!: JQuery<HTMLElement>;
  private $container: JQuery<HTMLElement>;
  private $currentWord!: JQuery<HTMLElement>;
  private $currentLetter!: JQuery<HTMLElement>;

  constructor() {
    this.$container = $('.text-field');
    this.lineHeight = parseFloat(this.$container.css('lineHeight')) || 24;

    this.setCaretPosition = this.setCaretPosition.bind(this);
    this.moveCaretPosition = this.moveCaretPosition.bind(this);
  }

  setCaretPosition(currWordIndx: number, currLetterIndx: number) {
    this.$currentWord = $('span.word').eq(currWordIndx);
    this.$currentLetter = this.$currentWord
      .find('span.letter')
      .eq(currLetterIndx);
    if (this.$currentLetter.length) {
      this.removeCaret();
      this.addCaret(this.$currentLetter);
      this.$caret = $('.letter.active');
      this.$caret.css({
        '--_left': '0',
        '--_right': 'none',
      });
      this.adjustScrollPosition();
    }
  }

  moveCaretPosition(
    currWordIndx: number,
    currLetterIndx: number,
    backspace?: boolean,
  ) {
    this.$currentWord = $('span.word').eq(currWordIndx);
    this.$currentLetter = this.$currentWord
      .find('span.letter')
      .eq(currLetterIndx);
    if (this.$currentLetter.length) {
      this.removeCaret();
      this.addCaret(this.$currentLetter);
      this.$caret = $('.letter.active');
      if (backspace) {
        this.$caret.css({
          '--_right': 'none',
          '--_left': '0',
          '--_caret-animation': 'none',
        });
      } else {
        this.$caret.css({
          '--_right': '0',
          '--_left': 'none',
          '--_caret-animation': 'none',
        });
      }
      this.adjustScrollPosition();
    }
  }

  private removeCaret() {
    $('span.letter').removeClass('active').removeAttr('style');
  }

  private addCaret($currLetterEl: JQuery<HTMLElement>) {
    $currLetterEl.addClass('active');
  }

  private adjustScrollPosition() {
    const $activeLetter = $('.letter.active');
    if (!$activeLetter.length) return;

    const letterPosition = $activeLetter.position();
    const containerHeight = this.$container.height() || 0;
    const currentScroll = this.$container.scrollTop() || 0;

    const lowerBound = containerHeight;

    if (letterPosition.top + this.lineHeight > lowerBound) {
      this.$container.animate(
        { scrollTop: currentScroll + this.lineHeight },
        100,
      );
    }
  }
}

export default Caret;
