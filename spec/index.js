
import SearchEngine from '../src/SearchEngine';

const testDataXml = require('raw!./test-data.xml');

describe('SearchEngine', () => {
  it('should search in chunks without "s" elements', () => {
    const testData = `
      <timedtext format="3">
        <body>
          <p t="1000">some text</p>
          <p t="10000">text start</p>
          <p t="20000">text body</p>
          <p t="30000">end text</p>
          <p t="40000">end text</p>
        </body>
      </timedtext>`;

    const searchEngine = new SearchEngine();
    searchEngine.setData(testData);
    const result = searchEngine.search('start text body end');
    expect(result.length).toBe(1);

  });

  it('s d', () => {
    const testData = testDataXml;

    const searchEngine = new SearchEngine();
    searchEngine.setData(testData);
    const result = searchEngine.search('первыми дисками посла');
    expect(result.length).toBe(1);
    expect(result[0].time).toBe(142.68);
  });
});
