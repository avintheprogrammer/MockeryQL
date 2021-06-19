import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const query = `
  query {
    mostPopularQuotes(source: parsely, tag: "Quote Single", count: 5, sortBy: "views", startPeriod: "55h") {
      assets {
        issueId
        issuerId
        exchangeName
        symbol
        name
        url
      }
    }
  }
`;

describe('mostPopularQuotes', () => {
  it('should return single trending quote from provided source like Parsely', async () => {
    const SingleSecuritySourceDataMock = require('./mocks/mostPopularQuotes/singleSecuritySourceData.json');
    const SingleSecurityQuoteDataMock = require('./mocks/mostPopularQuotes/singleSecurityQuoteData.json');
    const SingleSecurityResponseMock = require('./mocks/mostPopularQuotes/singleSecurityResponse.json');

    // Mock initial Source e.g. Parsely API request
    nock(nockHost)
      .get(new RegExp('/v2/analytics/posts?.*'))
      .reply(200, SingleSecuritySourceDataMock);

    // Mock initial Source e.g. Parsely API request
    nock(nockHost)
      .get(new RegExp('/quote-html-webservice/quote.htm?.*'))
      .reply(200, SingleSecurityQuoteDataMock);

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(SingleSecurityResponseMock);
  });

  it('should return multiple trending quote from provided source like Parsely', async () => {
    const MultipleSecuritySourceDataMock = require('./mocks/mostPopularQuotes/multipleSecuritySourceData.json');
    const MultipleSecurityQuoteDataMock = require('./mocks/mostPopularQuotes/multipleSecurityQuoteData.json');
    const MultipleSecurityResponseMock = require('./mocks/mostPopularQuotes/multipleSecurityResponse.json');

    // Mock initial Source e.g. Parsely API request
    nock(nockHost)
      .get(new RegExp('/v2/analytics/posts?.*'))
      .reply(200, MultipleSecuritySourceDataMock);

    // Mock initial Source e.g. Parsely API request
    nock(nockHost)
      .get(new RegExp('/quote-html-webservice/quote.htm?.*'))
      .reply(200, MultipleSecurityQuoteDataMock);

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(MultipleSecurityResponseMock);
  });
});
