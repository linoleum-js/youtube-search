
import SearchEngine from '../src/SearchEngine';

describe('SearchEngine', () => {
  it('should search in chunks without "s" elements', () => {
    const testData = `
      <timedtext format="3">
        <body>
          <p t="1">some text</p>
          <p t="10">text  start  </p>
          <p t="20">text body</p>
          <p t="30">end text</p>
        </body>
      </timedtext>`;

    const searchEngine = new SearchEngine();
    searchEngine.setData(testData);
    const result = searchEngine.search('start text body end');
    //expect(result.length).toBe(1);

  });

  it('should decide is start of one array is an end of another', () => {
    const searchEngine = new SearchEngine();
    let result = searchEngine.endOfFirstIsStartOfSecond(
      [0, 1, 2, 3], [1, 2, 3]
    );
    expect(result).toBe(2);
    result = searchEngine.endOfFirstIsStartOfSecond(
      [0, 1, 2, 3], [1, 2, 3, 4]
    );
    expect(result).toBe(2);
    result = searchEngine.endOfFirstIsStartOfSecond(
      [0, 1, 2, 4], [1, 2, 3, 4]
    );
    expect(result).toBe(-1);
  });

  it('should detect start, end and containment', () => {
    const searchEngine = new SearchEngine();
    const getP = () => {
      const parser = new DOMParser();
      const text = '<p t="10">1 2   3 4   5</p>';
      const dom = parser.parseFromString(text, 'text/xml');
      return dom.getElementsByTagName('p')[0];
    };
    let result = searchEngine.containsStart(
      getP(), '3 4 5 6 7'.split(' ')
    );
    expect(result).toBe(2);

    result = searchEngine.containsEnd(
      getP(), '1 2 3'.split(' ')
    );
    expect(result).toBe(2);

    result = searchEngine.contains(
      getP(), '2 3'.split(' ')
    );
    expect(result).toBe(true);

    result = searchEngine.contains(
      getP(), '2 4'.split(' ')
    );
    expect(result).toBe(false);
  });
});
