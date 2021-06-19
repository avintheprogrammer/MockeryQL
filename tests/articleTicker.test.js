import nock from 'nock';
import { graphql } from 'graphql';
import globalAppConfig from '../src/app/PhoenixQlConfig';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

// TODO: Add remaining article types
const queryableFields = `
  id
  slug
  type
  summary
  shorterDescription
  promoImage {
    id
  }
  title
  author {
    id
  }
  native
  premium
  headline
  publisher {
    name
    logo
  }
  description
`;

const { ARTICLE_TICKER_DEFAULT_ID, ARTICLE_TICKER_SPECIAL_REPORTS_ID }
  = globalAppConfig.getProperties();

describe('Article Ticker', () => {
  it('should return US Top News for a regular article', async () => {
    const id = 104847372;
    const CAPIArticleMock = require(`./mocks/capi/${id}.json`);
    const CAPIArticleTickerMock = require(`./mocks/capi/${ARTICLE_TICKER_DEFAULT_ID}.json`);
    const PhoenixQLArticleTickerMock = require(`./mocks/articleTicker/${id}.json`);

    nock(nockHost)
      .persist()
      .get(new RegExp(`/id/${id}?.*`))
      .reply(200, CAPIArticleMock);

    nock(nockHost)
      .persist()
      .get(new RegExp(`/list/id/${ARTICLE_TICKER_DEFAULT_ID}?.*`))
      .reply(200, CAPIArticleTickerMock);

    const query = `
    query {
      articleTicker(articleID: ${id}, page: 1, pageSize: 20) {
        assets {
          ... on cnbcnewsstory {
            ${queryableFields}
          }
          ... on slideshow {
            ${queryableFields}
          }
        }
      }
    }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(...resp).toEqual(...PhoenixQLArticleTickerMock);
  });

  it('should return special reports list for an article with subtype special_report', async () => {
    const id = 104757404;
    const CAPIArticleMock = require(`./mocks/capi/${id}.json`);
    const CAPIArticleTickerMock = require(`./mocks/capi/${ARTICLE_TICKER_SPECIAL_REPORTS_ID}.json`);
    const PhoenixQLArticleTickerMock = require(`./mocks/articleTicker/${id}.json`);

    nock(nockHost)
      .get(new RegExp(`/id/${id}?.*`))
      .reply(200, CAPIArticleMock);

    nock(nockHost)
      .get(new RegExp(`/list/id/${ARTICLE_TICKER_SPECIAL_REPORTS_ID}?.*`))
      .reply(200, CAPIArticleTickerMock);

    const query = `
    {
      articleTicker(articleID: ${id}, page: 1, pageSize: 20) {
        assets {
          ... on cnbcnewsstory {
            ${queryableFields}
          }
          ... on slideshow {
            ${queryableFields}
          }
        }
      }
    }
    `;
    const resp = await graphql(Schema, query, {}, createContext());
    expect(...resp).toEqual(...PhoenixQLArticleTickerMock);
  });

  it('should return null for an article with subtype primetime_show', async () => {
    const id = 104841713;
    const CAPIArticleMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLArticleTickerMock = require(`./mocks/articleTicker/${id}.json`);

    nock(nockHost)
      .get(new RegExp(`/id/${id}?.*`))
      .reply(200, CAPIArticleMock);

    const query = `
    {
      articleTicker(articleID: ${id}, page: 1, pageSize: 20) {
        assets {
          ... on cnbcnewsstory {
            ${queryableFields}
          }
          ... on slideshow {
            ${queryableFields}
          }
        }
      }
    }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(PhoenixQLArticleTickerMock);
  });
});
