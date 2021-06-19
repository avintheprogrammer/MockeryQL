import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const articleFields = `
  id
  type
  slug
  datePublished
  description
  headline
  title
  keyPoints
  promoImage {
    id
    url
    caption
    id
    type
  }
`;

describe('Most Popular', () => {
  it('should return all of the most popular\'s queryable fields from most popular source "Parsely"', async () => {
    const ParselyMock = require('./mocks/mostPopular/parselyResponse.json');
    const multipleArticlesResponse = require('./mocks/capi/104844669-104846604.json');
    const PhoenixQLMostPopularSourceMock = require('./mocks/mostPopular/graphQLSourceResponse.json');

    nock(nockHost)
      .get(new RegExp('/v2/analytics/posts?.*'))
      .reply(200, ParselyMock);

    nock(nockHost)
      .get(new RegExp('/id/?.*'))
      .reply(200, multipleArticlesResponse);

    const query = `
      query {
        mostPopular(source: parsely, tag: "Articles", count: 2, section: "Economy") {
          assets {
            ...on blogpost { ${articleFields} }
            ...on cnbcnewsstory { ${articleFields} }
          }
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLMostPopularSourceMock));
  });
});
