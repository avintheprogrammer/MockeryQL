import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const id = '100769431';
const marketCount = 5;
const securityCount = 5;
const articleCount = 30;

const CAPIListIDs = [
  id,
  '100003242',
  '10000528',
  '10000527',
  '10000728',
  '33057388',
  '15839203',
  '15839178',
  '17689937',
];

const queryableFields = `
  id
  type
  url
  summary
  shorterDescription
  title
  headline
  markets {
    name
    headline
    tabLabel
    securities {
      id
      tickerSymbol
      name
      type
    }
    articles {
      id
    }
  }
`;

describe('Market Banner', () => {
  it('should return a market banner for a given id with given counts on markets, securities, and articles', async () => {
    const PhoenixQLMarketBannerMock = require(`./mocks/marketBanner/${id}.json`);
    CAPIListIDs.map(CAPIListID =>
      nock(nockHost)
        .get(`/id/${CAPIListID}`)
        .query({ partner: 'pql01' })
        .reply(200, require(`./mocks/capi/marketBanner/${CAPIListID}.json`)));

    const query = `
      query {
        marketBanner(id: ${id}, marketCount: ${marketCount}, securityCount: ${securityCount}, articleCount: ${articleCount}) {
          ${queryableFields}
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLMarketBannerMock));
  });

  it('should return a market banner with only promoted data for a given id with given counts on markets, securities, and articles', async () => {
    const PhoenixQLNonPromotedMarketBanner = require(`./mocks/marketBanner/notPromoted/${id}.json`);
    CAPIListIDs.map(CAPIListID =>
      nock(nockHost)
        .get(`/id/${CAPIListID}`)
        .query({ partner: 'pql01' })
        .reply(200, require(`./mocks/capi/marketBanner/${CAPIListID}.json`)));

    const query = `
      query {
        marketBanner(id: ${id}, marketCount: ${marketCount}, securityCount: ${securityCount}, articleCount: ${articleCount}) {
          ${queryableFields}
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).not.toEqual(expect.objectContaining(PhoenixQLNonPromotedMarketBanner));
  });
});
