

import { $ } from './util';

export default class SearchEngine {
  constructor() {
    this.spyOnHttp();
  }

  searchInWords (list, query) {
    const occurrences = list.filter((item) => {
      return item.innerHTML.indexOf(query) !== -1;
    });
    return occurrences;
  }

  getTime (word) {
    return word.parentNode.getAttribute('t') / 1000;
  }

  handleSubtitlesLoad (response) {
    const parser = new DOMParser();
    const subtitles = parser.parseFromString(response, 'text/xml');
    const words = subtitles.getElementsByTagName('s');
    this.words = [].slice.call(words, 0);
  }

  search (query) {
    const result = this.searchInWords(this.words, query);
    return result.map((word) => {
      return this.getTime(word);
    });
  }

  spyOnHttp() {
    const send = XMLHttpRequest.prototype.send;
    const self = this;

    XMLHttpRequest.prototype.send = function () {
      this.onload = function () {
        if (this.responseURL.indexOf('timedtext') === -1) {
          return;
        }
        
        self.handleSubtitlesLoad(this.response);
      };
      send.apply(this, arguments);
    };
  }
}
