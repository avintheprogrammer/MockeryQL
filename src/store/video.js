/* eslint-disable import/prefer-default-export */
import Logger from '../lib/logger';
import { resolveVideoWithTranscript } from '../helpers/video';
import NetworkRequest from '../lib/networkRequest';
import getRecommendationIds from '../helpers/recommendations';

async function find(
  args = {},
  { transcripts, chapterTranscript },
  { capi, networkClient },
) {
  const qs = { includeTranscript: !!transcripts };
  let capiArgs = { id: args.id };

  // TODO: Remove this logic, in favor of calling getRecommendations
  if (args.videoRecommendation) {
    const recommendedVideoIds = await getRecommendationIds(
      {
        tag: 'Videos',
        url: args.url,
        count: 1,
      },
      networkClient,
    );
    capiArgs = { id: recommendedVideoIds[0] };
  }

  const response = await capi.find(capiArgs, { qs });
  if (response.videoTranscript) return resolveVideoWithTranscript(response, chapterTranscript);
  return response;
}

async function getRecommendations(
  { url, count },
  { transcripts, chapterTranscript },
  { capi, networkClient },
) {
  const qs = { includeTranscript: !!transcripts };
  const recommendedVideoIds = await getRecommendationIds(
    {
      tag: 'Videos',
      count,
      url,
    },
    networkClient,
  );

  return Promise.all(recommendedVideoIds.map(async (id) => {
    try {
      const video = await capi.find({ id }, { qs });
      if (video.videoTranscript) return resolveVideoWithTranscript(video, chapterTranscript);
      return video;
    }
    catch (e) {
      Logger.error(`Could not load content id ${id}`);
      return null;
    }
  })).then((videos) => videos.filter((v) => v)); // filter out the nulls
}

export function createStore({ capi }) {
  const networkClient = new NetworkRequest();
  return {
    find: (args, options) => find(args, options, { capi, networkClient }),
    getRecommendations: (args, options) =>
      getRecommendations(args, options, { capi, networkClient }),
  };
}
