
export default class SearchEngine {
  constructor(text) {
    this.setData(text);
  }
  /**
   *
   * @param {string} query
   * @returns {Array}
   */
  searchInChunks (query) {
    let currentOffset = 0;
    let currentSearchResult;
    const result = [];
    query = query.trim().replace(/\s+/, ' ');

    do {
      currentSearchResult = this.searchFromIndex(query, currentOffset);
      if (currentSearchResult) {
        result.push(currentSearchResult);
        currentOffset = currentSearchResult.offsetEnd;
      }
    } while (currentSearchResult);

    return result;
  }

  searchFromIndex(query, startIndex) {
    const offsetStart = this.getSubstringStart(query, startIndex);
    if (offsetStart === -1) { return null; }
    const offsetEnd = offsetStart + query.length;

    const firstChunkOffset = this.getClosestLeftChunkOffset(offsetStart);
    const lastChunkOffset = this.getClosestLeftChunkOffset(offsetEnd);
    const chunks = this.getChunksInSegment(firstChunkOffset, lastChunkOffset);
    const time = this.getChunksStartTime(chunks);

    return {
      chunks,
      offsetStart,
      offsetEnd,
      time
    }
  }

  getChunksStartTime(chunks) {
    const firstChunk = chunks[0].data;
    return this.getTime(firstChunk);
  }

  getChunksInSegment(start, end) {
    let result = [];
    for (let offset = start; offset <= end; offset++) {
      const chunk = this.mapOffsetToChunk(offset);
      if (chunk) {
        result.push({
          offset: offset,
          data: chunk
        });
      }
    }
    return result;
  }

  getClosestLeftChunkOffset(offset) {
    let result;
    do {
      result = this.mapOffsetToChunk(offset);
      offset--;
    } while (offset && !result);

    return offset + 1;
  }

  getSubstringStart(query, startIndex) {
    return this.subtitles.indexOf(query, startIndex);
  }

  /**
   * get time offset of specified sentence
   * @param  {HTMLElement} chunk
   * @return {number} time in seconds
   */
  getTime (chunk) {
    return chunk.getAttribute('t') / 1000;
  }

  /**
   * init textChunks
   * @param  {string} text - text that represents subtitles
   */
  setData (text) {
    const parser = new DOMParser();
    const subtitles = parser.parseFromString(text, 'text/xml');
    const sentences = subtitles.getElementsByTagName('p');

    // remove spaces
    this.textChunks = sentences::[].slice(0).map((chunk) => {
      const cleanText = chunk.textContent.replace(/\s+/g, ' ');
      chunk.textContent = cleanText;
      return chunk;
    });
    this.subtitles = this.textChunks.map((chunk) => {
      return chunk.textContent.trim();
    }).filter(item => item).join(' ');
    this.initOffsets();
  }

  initOffsets() {
    const offsets = {};
    let currentOffset = 0;
    this.textChunks.forEach((chunk) => {
      offsets[currentOffset] = chunk;
      currentOffset += chunk.textContent.length;
    });
    this.offsets = offsets;
  }

  mapOffsetToChunk(offset) {
    return this.offsets[offset];
  }

  /**
   * @param  {string} query
   * @return {Array<string>} occurrences
   */
  search (query) {
    const res = this.searchInChunks(query);
    return res;

  }
}
