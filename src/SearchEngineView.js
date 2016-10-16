

import { $, debounce } from './util';
import MarksView from './MarksView';
import {
  OPENED_FORM_CLASS,
  BUTTON_OPEN_CLASS,
  BUTTON_CLOSE_CLASS,
  INPUT_CLASS,
  CONTAINER_CLASS
} from './constants';

export default class SearchEngineView {
  constructor(searchEngine) {
    this.opened = false;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleChange = debounce(1000, this.handleChange.bind(this));
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.searchEngine = searchEngine;
    $.on(document, 'DOMContentLoaded', () => {
      this.init();
      this.render();
    });
  }

  init() {
    this.$container = $(CONTAINER_CLASS);
    this.remplate = require('../templates/search-form.html');
    this.marksView = new MarksView();
    this.marksView.loadSubtitles();
  }

  render() {
    if (this.$node) {
      this.$container.removeChild(this.$node);
    }
    const tabIndexInput = this.open ?
      '' : 'tabindex="-1"';
    const tabIndexClose = this.open ?
      'tabindex="-1"' : '';
    this.$node = $.renderFromString(this.remplate, {
      className: this.opened ? OPENED_FORM_CLASS: '',
      tabIndexInput: tabIndexInput,
      tabIndexClose: tabIndexClose
    });

    this.initEvents();

    const $firstControl = this.$container.children[0];
    this.$container.insertBefore(
      this.$node, $firstControl
    );  
  }

  initEvents() {
    const $buttonOpen = $(BUTTON_OPEN_CLASS, this.$node);
    const $buttonClose = $(BUTTON_CLOSE_CLASS, this.$node);
    const $input = $(INPUT_CLASS, this.$node);
    this.$input = $input;
    $.on($buttonOpen, 'click', this.open);
    $.on($buttonClose, 'click', this.close);
    $.on($input, 'keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    // prevent default actions (i.e. fullscreen)
    event.stopPropagation();
    // close on escape
    if (event.keyCode === 27) {
      this.close();
      return;
    } else {
      this.handleChange(event);
    }
  }

  handleChange(event) {
    this.clear();
    const query = this.$input.value;
    if (query.length < 3) { return; }
    const occurrences = this.searchEngine.search(query);
    this.marksView.renderMarks(occurrences);
  }

  clear() {
    this.marksView.removeMarks();
  }

  open() {
    this.opened = true;
    this.render();
  }

  close() {
    this.opened = false;
    this.$input.value = '';
    this.render();
    this.marksView.removeMarks();
  }
}
