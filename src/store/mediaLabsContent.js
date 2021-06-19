/* eslint-disable import/prefer-default-export */

import BuffettMock from '../mocks/buffettTranscriptMock.json';

/**
 * Example of query that hits this code:
 * @example
 * query MediaLabsContent($clip: String) {
 *   mediaLabsContent(clip: $clip) {
 *     chapter,
 *     cues
 *   }
 * }
 */

/**
 * Generates additional JSON to be appended to response for use with adding chapter timepoints
 * to JW Player.
 * @param {object} obj
 * @returns {object}
 */
function generateVideoCues(obj) {
  const chapters = obj.chapter;
  const cues = (chapters.map((chapter) => {
    const cue = {};
    cue.begin = chapter.in;
    cue.text = chapter.title;
    return cue;
  }));
  return cues;
}

/**
 * Formats the output with all the data needed by the front end.
 * @param {object} obj
 * @returns {object}
 */
function formatOutput(obj) {
  let formattedOutput = obj;
  formattedOutput = { ...obj, cues: generateVideoCues(obj) };
  return formattedOutput;
}

/**
 * Provides single inteface to a mock of the presumed output from CAPI for Buffett long-form videos
 * @returns {object}
 */
function find() {
  return formatOutput(BuffettMock);
}

export function createStore() {
  return {
    find: () => find(),
  };
}
