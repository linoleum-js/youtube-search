
import { $, spyOnHttp, triggerEvent } from './util';
import SearchEngine from './SearchEngine';
import ControlsView from './ControlsView';
import MarksView from './MarksView';
import {
  VIDEO_ELEMENT_CLASS,
  SUBTITLES_BUTTON_CLASS
} from './constants';

export default class Controller {
  constructor() {
    spyOnHttp(this.httpSpy);
    this.searchEngine = new SearchEngine();
    $.on(document, 'DOMContentLoaded', this.init);
  }

  init = () => {
    this.$videoElement = $(VIDEO_ELEMENT_CLASS);
    this.$subtitlesButton = $(SUBTITLES_BUTTON_CLASS);
    this.loadSubtitles();
    this.createViews();
  }

  createViews = () => {
    this.resultView = new MarksView({
      onTimeChange: this.gotoTime
    });
    this.controlsView = new ControlsView({
      onSeachQueryChange: this.onSeachQueryChange,
      onClose: this.clear
    });
  }

  onSeachQueryChange = (query) => {
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
  gotoTime = (time) => {
    this.$videoElement.currentTime = time - 1;
  }

  changeView = (viewName) => {
    this.resultView.remove();
  }


  /**
   * @param  {string} response - text that represents subtitles
   */
  handleSubtitlesLoad(response) {
    this.clear();
    this.searchEngine.setData(response);
  }

  httpSpy = (xhr) => {
    if (!xhr.responseURL.includes('timedtext')) {
      return;
    }
    
    this.handleSubtitlesLoad(xhr.response);
  }

  loadSubtitles = () => {
    setTimeout(() => {
      triggerEvent(this.$subtitlesButton, 'click');
      triggerEvent(this.$subtitlesButton, 'click');
    }, 1000);
  }
}
