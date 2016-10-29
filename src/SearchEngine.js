
export default class SearchEngine {
  searchInChunks1 (chunks, query) {
    const occurrences = chunks.filter((item) => {
      return item.textContent.includes(query);
    });
    return occurrences;
  }

  /**
   * fuzzy search
   * 
   * @param  {Array<Node>} chunks
   * @param  {string} query
   * @param  {boolean?} entireWord
   * @return {Array}
   */
  searchInChunks (chunks, query) {
    const queryWords = query.split(/\s+/).map((item) => {
      return item.toLowerCase();
    });

    const occurrences = chunks.filter((item, index) => {
      return item.textContent.includes(query);
    });
    return occurrences;
  }

  /**
   * @param {Node} chunk
   * @param {Array<string>} words
   */
  contains(chunk, words) {
    const chunkWords = this.splitChunk(chunk);
    return chunkWords::String.prototype.includes(words);
  }

  /**
   * @param {Node} chunk
   * @param {Array<string>} words
   */
  containsEnd(chunk, words) {
    const chunkWords = this.splitChunk(chunk);
    return this.endOfFirstIsStartOfSecond(
      words, chunkWords
    );
  }

  /**
   * @param {Node} chunk
   * @param {Array<string>} words
   */
  containsStart(chunk, words) {
    const chunkWords = this.splitChunk(chunk);
    return this.endOfFirstIsStartOfSecond(
      chunkWords, words
    );
  }

  /**
   * @param {Node} chunk
   * @returns {Array<string>}
   */
  splitChunk(chunk) {
    return chunk.textContent.split(/\s+/).map((item) => {
      return item.toLowerCase();
    });
  }

  /**
   * @param {Array} a
   * @param {Array} b
   */
  endOfFirstIsStartOfSecond(a, b) {
    let stateIn = false;
    let pointer = 0;

    a.forEach((item) => {
      if (item === b[pointer]) {
        pointer++;
        stateIn = true;
      } else {
        pointer = 0;
        stateIn = false;
      }
    });
    return pointer - 1;
  }

  /**
   * get time offset of specified sentence
   * @param  {HTMLElement} sentence
   * @return {number} time in seconds
   */
  getTime (sentence) {
    return sentence.getAttribute('t') / 1000;
  }

  /**
   * init textChunks
   * @param  {string} text - text that represents subtitles
   */
  setData (text) {
    const parser = new DOMParser();
    const subtitles = parser.parseFromString(text, 'text/xml');
    const sentences = subtitles.getElementsByTagName('p');

    this.textChunks = sentences::[].slice(0);
  }

  /**
   * @param  {string} query
   * @return {Array<string>} occurrences
   */
  search (query) {
    const result = this.searchInChunks(this.textChunks, query);
    return result.map((sentence) => {
      return {
        time: this.getTime(sentence)
      }
    });
  }
}
