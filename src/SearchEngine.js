

import { $, spyOnHttp } from './util';

export default class SearchEngine {
  constructor() {
    spyOnHttp(this.spy);
  }

  searchInChunks (chunks, query) {
    const occurrences = chunks.filter((item) => {
      return item.textContent.includes(query);
    });
    return occurrences;
  }

  /**
   * get time offset of specified sentence
   * @param  {Node} sentence
   * @return {number} time in seconds
   */
  getTime (sentence) {
    return sentence.getAttribute('t') / 1000;
  }

  /**
   * init textChunks
   * @param  {string} response - text that represents subtitles
   */
  handleSubtitlesLoad (response) {
    const parser = new DOMParser();
    const subtitles = parser.parseFromString(response, 'text/xml');
    const sentences = subtitles.getElementsByTagName('p');
    console.log(sentences);

    this.textChunks = [].slice.call(sentences, 0);
  }

  /**
   * @param  {string} query
   * @return {Array<string>} occurrences
   */
  search (query) {
    const result = this.searchInChunks(this.textChunks, query);
    return result.map((sentence) => {
      return this.getTime(sentence);
    });
  }

  spy = (xhr) => {
    if (!xhr.responseURL.includes('timedtext')) {
      return;
    }
    
    this.handleSubtitlesLoad(xhr.response);
  }
}
