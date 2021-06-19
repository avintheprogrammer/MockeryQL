/* eslint-disable import/prefer-default-export */

import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import mockApiResponse from './mocks/buffettQuote/apiResponse.json';
import { url } from '../src/config/buffettQuote.json';
import { createContext } from './helpers';

describe('Buffett Quote', () => {
  it('should return a buffett quote', async () => {
    const query = `
      query {
        buffettQuote {
          link
          label
          text
          date
        }
      }
    `;

    nock(url)
      .get('')
      .reply(200, mockApiResponse);

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp.data.buffettQuote).toHaveProperty('link');
    expect(resp.data.buffettQuote).toHaveProperty('label');
    expect(resp.data.buffettQuote).toHaveProperty('text');
    expect(resp.data.buffettQuote).toHaveProperty('date');
  });
});
