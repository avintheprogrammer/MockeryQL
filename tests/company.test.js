import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

describe('Company', () => {
  it('should return all of a company\'s queryable fields', async () => {
    const id = 104835413;
    const CAPICompanyMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLCompanyMock = require(`./mocks/company/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPICompanyMock);

    const query = `
      query {
        company(id: ${id}) {
          id
          type
          brand
          slug
          url
          summary
          shorterDescription
          contentUrl
          name
          premium
          native
          publisher {
            name
            logo
          }
          datePublished
          tickerSymbol
          issuerId
          sourceOrganization {
            id
          }
          symbol
          exchangeName
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLCompanyMock));
  });
});
