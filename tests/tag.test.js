import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFields = `
  id
  title
  url
  subType
`;

describe('Tag', () => {
  describe('should return all of a tag\'s queryable fields', async () => {
    const id = 104847504;
    const url = '/ajit-jain/';
    const CAPITagMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLTagMock = require(`./mocks/tag/${id}.json`);

    it('should return the fields by id', async () => {
      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPITagMock);

      const query = `
        query {
          tag(id: ${id}) {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLTagMock));
    });

    it('should return the fields by url', async () => {
      nock(nockHost)
        .get(`/url/${encodeURIComponent(url)}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPITagMock);

      const query = `
        query {
          tag(url: "${url}") {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLTagMock));
    });
  });
});
