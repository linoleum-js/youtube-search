
import {
  $, formatTime, triggerEvent, getParent
} from './util';

import {
  DURATION_CLASS,
  TIMELINE_CLASS,
  SUBTITLES_BUTTON_CLASS,
  PROGRESS_BAR_CLASS,
  BOTTOM_PANE_CLASS
} from './constants';

export default class MarksView {
  constructor(props) {
    this.onTimeChange = props.onTimeChange;

    this.$timeline = $(TIMELINE_CLASS);
    this.$duration = $(DURATION_CLASS);
    this.$progressBar = $(PROGRESS_BAR_CLASS);
    this.$subtitlesButton = $(SUBTITLES_BUTTON_CLASS);
    this.$bottomPane = $(BOTTOM_PANE_CLASS);
    this.markTemplate = require('../templates/mark.html');
    this.markContainerTemplate =
      require('../templates/mark-container.html');

    this.renderContainer();
  }

  /**
   * get duration in seconds
   * @return {number}
   */
  getDuration() {
    if (!this.duration) {
      const stringValue = this.$progressBar
        .getAttribute('aria-valuemax');
      const value = Number.parseInt(stringValue, 10);
      this.duration = value;
    }

    return this.duration;
  }

  /**
   * get width of one second (in pixels)
   * @return {number}
   */
  getSecondWidth () {
    return this.$timeline.offsetWidth / this.getDuration();
  }

  /**
   * @param  {number} time - time in seconds
   */
  appendMark (time) {
    const timeString = formatTime(time);
    const markWidth = 50;
    const left = 
      time * this.getSecondWidth() - markWidth / 2;

    const $node = $.renderFromString(this.markTemplate, {
      time: timeString,
      timeValue: time,
      left: left
    });

    this.$container.appendChild($node);
  }

  /**
   * create container, save ref to the node
   */
  renderContainer () {
    const $node = $.renderFromString(this.markContainerTemplate);
    this.$container = $node;
    $.on(this.$container, 'click', this.clickHandler);
    this.$bottomPane.appendChild($node);
  }

  clickHandler = (event) => {
    const $target = event.target;
    const $mark = getParent($target, ($node) => {
      return $node.hasAttribute('data-time');
    });
    const timeString = $mark.getAttribute('data-time');
    const time = Number.parseInt(timeString, 10);
    this.onTimeChange(time);
  }

  /**
   * @param  {Array<number>} list
   */
  renderMarks(list) {
    list.forEach((time) => {
      this.appendMark(time);
    });
  }

  /**
   */
  removeMarks () {
    this.$container.innerHTML = '';
  }

  loadSubtitles() {
    // load subtitles. wut, wut, wut...
    this.$subtitlesButton.click();
  }
}
