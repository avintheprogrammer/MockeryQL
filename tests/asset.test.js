import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFields = `
  id
  type
  brand
  summary
  shorterDescription
  slug
  url
  contentUrl
  datePublished
  dateLastPublished
  dateModified
  title
  headline
  description
  premium
  native
  sameAs
  publisher {
   name
   logo
  }
  author {
   id
  }
  section {
   id
  }
  sourceOrganization {
   id
  }
`;

describe('Asset', () => {
  it('should return base fields via id', async () => {
    const id = 104790019;
    const CAPIAssetMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLAssetMock = require(`./mocks/asset/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIAssetMock);

    const query = `
      query {
        asset(id: ${id}) {
          ${queryableFields}
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLAssetMock));
  });

  it('should return base fields via url', async () => {
    const id = 104790019;
    const url = '/2017/10/23/elon-musk-tesla-cars-will-be-self-driving-and-know-your-schedule.html';
    const CAPIAssetMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLAssetMock = require(`./mocks/asset/${id}.json`);

    nock(nockHost)
      .get(`/url/${encodeURIComponent(url)}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIAssetMock);

    const query = `
      query {
        asset(url: "${url}") {
          ${queryableFields}
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLAssetMock));
  });
});
