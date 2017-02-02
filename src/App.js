
import { $, spyOnHttp, triggerEvent, onUrlChange } from './util';
import SearchEngine from './SearchEngine';
import ControlsView from './ControlsView';
import MarksView from './MarksView';
import {
  VIDEO_ELEMENT_CLASS,
  SUBTITLES_BUTTON_CLASS
} from './constants';

export default class App {
  constructor() {
    spyOnHttp(this.httpSpy);
    onUrlChange(this.removeViews);
    $.on(document, 'DOMContentLoaded', this.init);
  }

  init = () => {
    this.$videoElement = $(VIDEO_ELEMENT_CLASS);
  }

  createViews = () => {
    this.resultView = new MarksView({
      onTimeChange: this.goToTime
    });
    this.controlsView = new ControlsView({
      onSearchQueryChange: this.onSearchQueryChange,
      onClose: this.clear
    });
  }

  removeViews = () => {
    if (this.controlsView) {
      this.controlsView.remove();
      this.controlsView = null;
      this.resultView.remove();
      this.resultView = null;
    }
  }

  onSearchQueryChange = (query) => {
    this.clear();
    if (query.length < 3) { return; }
    const occurrences = this.searchEngine.search(query);
    this.resultView.render(occurrences);
  }

  clear = () => {
    this.resultView.clear();
  }


  /**
   * @param  {number} time
   */
  goToTime = (time) => {
    this.$videoElement.currentTime = time - 1;
  }


  /**
   * @param  {string} response - text that represents subtitles
   */
  handleSubtitlesLoad = (response) => {
    this.removeViews();
    this.searchEngine = new SearchEngine(response);
    this.createViews();
  }

  /**
   * @param {XMLHttpRequest} xhr
   */
  httpSpy = (xhr) => {
    if (!xhr.responseURL.includes('timedtext')) {
      return;
    }
    
    this.handleSubtitlesLoad(xhr.responseText);
  }
}
