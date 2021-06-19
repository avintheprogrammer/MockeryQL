import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

describe('Webservice', () => {
  it('should return all of a webservice\'s queryable fields', async () => {
    const id = 104819403;
    const CAPIWebserviceMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLWebserviceMock = require(`./mocks/webservice/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIWebserviceMock);

    const query = `
      query {
        webservice(id:${id}) {
          id
          slug
          type
          summary
          shorterDescription
          brand
          title
          native
          premium
          publisher {
            name
            logo
          }
          contentUrl
          widget
          datePublished
          widgetDisplayName
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLWebserviceMock));
  });
});
