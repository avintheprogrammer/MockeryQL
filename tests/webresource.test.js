import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

describe('Webresource', () => {
  it('should return all of a webresource\'s queryable fields', async () => {
    const id = 104782744;
    const CAPIWebresourceMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLWebresourceMock = require(`./mocks/webresource/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIWebresourceMock);

    const query = `
      query {
        webresource(id: ${id}) {
          id
          linkText
          isFeed
          refreshInterval
          lastRefreshTime
          href
          linkTitle
          linkTarget
          linkRel
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLWebresourceMock));
  });
});
