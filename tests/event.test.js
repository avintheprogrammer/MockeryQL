import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFields = `
  id
  type
  brand
  slug
  summary
  shorterDescription
  url
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
  articlebody
  body
  keyPoints
  dateModified
  datePublished
  dateLastPublished
  startDate
  endDate
  timezone
  registrationDeadlineDate
  status
  capacity
  phone
  email
  landingPage
  location
  image {
    id
  }
`;

describe('Event', () => {
  describe('should return all of an event\'s queryable fields', async () => {
    const id = 47630621;
    const url = '/2012/07/28/farnborough-international-airshow-2012.html';
    const CAPIEventMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLEventMock = require(`./mocks/event/${id}.json`);

    it('should return the fields by id', async () => {
      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIEventMock);

      const query = `
        query {
          event(id: ${id}) {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLEventMock));
    });

    it('should return the fields by url', async () => {
      nock(nockHost)
        .get(`/url/${encodeURIComponent(url)}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIEventMock);

      const query = `
        query {
          event(url: "${url}") {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLEventMock));
    });
  });
});
