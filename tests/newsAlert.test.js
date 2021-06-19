import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

describe('News Alert', () => {
  it('should return breakingNews and watchLive as fields', async () => {
    const PhoenixQLNewsAlertMock = require('./mocks/newsAlert/response.json');

    [20991458, 202].map(CAPIListID =>
      nock(nockHost)
        .persist()
        .get(new RegExp(`/list/id/${CAPIListID}?.*`))
        .reply(200, require(`./mocks/capi/${CAPIListID}.json`)));

    const query = `
      query {
        newsAlert(product: web) {
          breakingNews {
            title
            headline
            url
          }
          watchLive {
            title
            headline
            url
          }
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLNewsAlertMock));
  });
});
