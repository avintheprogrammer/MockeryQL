import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const getImageMockData = (id) => {
  const CAPIImageMock = require(`./mocks/capi/${id}.json`);
  let PhoenixQLImageMock;

  try {
    PhoenixQLImageMock = require(`./mocks/image/${id}.json`);
  } catch (e) {
    /* eslint-disable no-empty */
  }

  return {
    CAPIImageMock,
    PhoenixQLImageMock,
  };
};

describe('Image', () => {
  it('should return all of an image\'s queryable fields', async () => {
    const id = 104307423;
    const { CAPIImageMock, PhoenixQLImageMock } = getImageMockData(id);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIImageMock);

    const query = `
      query {
        image(id: ${id}) {
          id
          type
          creatorOverwrite
          contentSize
          caption
          filter
          height
          width
          url
          summary
          shorterDescription
          datePublished
          dateModified
          dateLastPublished
          publisher {
            name
            logo
          }
          focalPoints {
            x
            y
            height
            width
          }
          copyrightHolder
          slug
          description
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLImageMock));
  });

  describe('when cn:creatorOverwrite does not exist', () => {
    it('creatorOverwrite is null', async () => {
      const id = 9999; /* Making up dummy data since capi "always" returns cn:creatorOverwrite */
      const { CAPIImageMock } = getImageMockData(id);

      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIImageMock);

      const query = `
        query {
          image(id: ${id}) {
            creatorOverwrite
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp.data.image.creatorOverwrite).toBeNull();
    });
  });

  describe('when cn:creatorOverwrite is ""', () => {
    it('creatorOverwrite is null', async () => {
      const id = 104824953;
      const { CAPIImageMock } = getImageMockData(id);

      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIImageMock);

      const query = `
        query {
          image(id: ${id}) {
            creatorOverwrite
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp.data.image.creatorOverwrite).toBeNull();
    });
  });

  describe('when cn:creatorOverwrite contains a string value "ok"', () => {
    it('creatorOverwrite returns the same string "ok"', async () => {
      const id = 104824952;
      const { CAPIImageMock } = getImageMockData(id);

      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIImageMock);

      const query = `
        query {
          image(id: ${id}) {
            creatorOverwrite
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp.data.image.creatorOverwrite).toBe('ok');
    });
  });
});
