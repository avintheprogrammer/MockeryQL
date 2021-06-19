import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFields = `
  id
  type
  slug
  url
  summary
  shorterDescription
  contentUrl
  datePublished
  subType
  name
  description
  publisher {
    name
    logo
  }
  related {
    id
    type
    ... on franchise {
      url
    }
  }
  assets {
    id
    type
  }
`;

// TODO: Add remaining article types
describe('Collection', () => {
  it('should return a collection', async () => {
    const id = 104832573;
    const page = 1;
    const pageSize = 2;
    const CAPIIDCollectionMock = require(`./mocks/capi/${id}/id.json`);
    const CAPIListIDCollectionMock = require(`./mocks/capi/${id}/listId.json`);
    const PhoenixQLCollectionMock = require(`./mocks/collection/${id}.json`);

    nock(nockHost)
      .get(new RegExp(`/id/${id}?.*`))
      .reply(200, CAPIIDCollectionMock);

    nock(nockHost)
      .get(new RegExp(`/list/id/${id}?.*`))
      .reply(200, CAPIListIDCollectionMock);

    const query = `
      query {
        collection(id: ${id}, page: ${page}, pageSize: ${pageSize}) {
          ${queryableFields}
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLCollectionMock));
  });
});
