
import {
  $, formatTime, triggerEvent
} from './util';

import {
  DURATION_CLASS, TIMELINE_CLASS, SUBTITLES_BUTTON_CLASS
} from './constants';

export default class MarksView {
  constructor() {
    this.$timeline = $(TIMELINE_CLASS);
    this.$duration = $(DURATION_CLASS);
    this.$subtitlesButton = $(SUBTITLES_BUTTON_CLASS);
    this.markTemplate = require('../templates/mark.html');
  }

  getDuration() {
    const html = this.$duration.innerHTML;
    const parts = html.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }

  getSecondWidth () {
    return this.$timeline.offsetWidth / this.getDuration();
  }

  appendMark (time) {
    const timeString = formatTime(time);
    const markWidth = 50;
    const left = 
      time * this.getSecondWidth() - markWidth / 2;

    const $node = $.renderFromString(this.markTemplate, {
      time: timeString,
      left: left + 'px'
    });

    this.$timeline.appendChild($node);
  }

  renderMarks(list) {
    list.forEach((time) => {
      this.appendMark(time);
    });
  }

  removeMarks () {
    this.$timeline.innerHTML = '';
  }

  loadSubtitles() {
    // load subtitles. wut, wut, wut...
    this.$subtitlesButton.click();
    setInterval(() => {
      this.$subtitlesButton.click();
    });
  }
}
