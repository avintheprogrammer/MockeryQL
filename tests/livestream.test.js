import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { createContext } from './helpers';

const livestreamFields = `
  protectedURL
  timeZone
  altURL
  name
  inCache
  startTime
  url
  remaining
  tokenGenerator
  ignoreWeekend
  restricted
  endTime
`;

describe('livestream', () => {
  it('should return all of the livestream\'s queryable fields for the override', async () => {
    const VideoTokenMock = require('./mocks/livestream/bedrockvideotoken.json');
    const LivestreamMock = require('./mocks/livestream/livestream.json');
    const PhoenixQLLivestreamResponse = require('./mocks/livestream/graphQLOverrideResponse.json');

    nock('http://register-qa.cnbc.com')
      .get(new RegExp('/auth/api/14/payload?.*'))
      .reply(200, VideoTokenMock);

    nock('https://vapi-qa.cnbc.com')
      .get(new RegExp('/videoservice/getstream.do?.*'))
      .reply(200, LivestreamMock);

    const query = `
      query {
        livestream(uid: "0a7aadff5ed247a9ba01cd91cb0107cb", sessionToken: "d28b56cfa389545f93cd38c609eb1b51ccf4e9dd", streamName: "Akamai-US-Stream") {
          ${livestreamFields}
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLLivestreamResponse));
  });
});
