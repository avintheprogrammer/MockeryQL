import { getParamObject } from '../src/helpers/mostPopular';

describe('mostPopular.getParamObject()', () => {
  it('can build Parse.ly analytics params', () => {
    const args = {
      source: 'PARSELY',
      count: 20,
      tag: 'MyTag',
      sortBy: 'MySort',
      startPeriod: 'StartPeriod',
    };
    expect(getParamObject(args)).toEqual({
      limit: 20,
      tag: 'MyTag',
      sort: 'MySort',
      period_start: 'StartPeriod',
    });
  });
  it('can build Parse.ly recs params', () => {
    const args = {
      source: 'PARSELY_RELATED',
      tag: 'MyTag',
      url: 'http://url',
      count: 20,
    };
    expect(getParamObject(args)).toEqual({
      tag: 'MyTag',
      url: 'http://url',
      limit: 20,
      respect_empty_results: 1,
      apikey: 'cnbc.com',
    });
  });
  it('ignores tag if section is passed', () => {
    const args = {
      source: 'PARSELY',
      tag: 'MyTag',
      section: 'MySection',
      count: 20,
    };
    expect(getParamObject(args)).toEqual({
      limit: 20,
    });
  });
  it('ignores extra args not defined in mapping', () => {
    const args = {
      source: 'PARSELY',
      foo: 'Bar', // unknonw param
      sortBy: 'MySort',
    };
    expect(getParamObject(args)).toEqual({
      sort: 'MySort',
    });
  });
});