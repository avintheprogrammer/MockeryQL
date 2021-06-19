import getRecommendationIds from '../src/helpers/recommendations/parsely';
import parselyData from './mocks/mostPopular/parselyResponse.json';

describe('getRecommendationIds()', () => {
  it('should return empty if missing required params', () => {
    const networkClient = {
      load: jest.fn(),
    };
    const url = 'http://google.com';
    const count = 10;
    const tag = 'Video';
    const noUrl = { url: null, count, tag };
    const noCount = { url, count: null, tag };
    const noTag = { url, count, tag: null };
    const promises = [noUrl, noCount, noTag].map((args) => (
      getRecommendationIds(args, networkClient)
    ));

    expect.assertions(4);
    return Promise.all(promises).then((results) => {
      results.forEach((result) => {
        expect(result).toEqual([]);
      });
    }).then(() => {
      expect(networkClient.load).not.toBeCalled();
    });
  });
  it('should call Parse.ly API with appropriate parameters', () => {
    const networkClient = {
      load: jest.fn().mockReturnValue(parselyData),
    };
    const args = {
      url: 'http://google.com',
      count: 10,
      tag: 'Videos',
    };
    expect.assertions(2);
    return getRecommendationIds(args, networkClient).then((results) => {
      expect(networkClient.load).toBeCalledWith({
        url: 'https://parsely.cnbc.com/v2/related?apikey=cnbc.com&limit=10&respect_empty_results=1&tag=Videos&url=http%3A%2F%2Fgoogle.com',
      });
      expect(results).toEqual(['104937964', '104964343']);
    });
  });
});
