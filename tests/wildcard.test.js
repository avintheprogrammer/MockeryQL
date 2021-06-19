import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

describe('Wildcard', () => {
  it('should return all of a wildcard\'s queryable fields', async () => {
    const id = 104770291;
    const CAPIWildcardMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLWildcardMock = require(`./mocks/wildcard/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIWildcardMock);

    const query = `
      query {
        wildcard(id:${id}) {
          id
          slug
          creatorOverwrite
          summary
          shorterDescription
          type
          brand
          contentUrl
          datePublished
          publisher {
            name
            logo
          }
          contentText
          promoText
          native
          premium
          image { id }
          body {
            content {
              tagName
              attributes
              children  
            }
          }
          keyPoints
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLWildcardMock));
  });
});
