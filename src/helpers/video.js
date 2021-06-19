/* eslint-disable import/prefer-default-export, consistent-return  */
import { merge, cloneDeep } from 'lodash';
import { isPremium, isNative } from './asset';
import * as playerConfig from '../config/vod_video';

export function resolveImage({ associations }) {
  return (associations || []).find(association => association.type === 'image');
}

/**
 * @desc resolves the playback URL
 * @returns string
 */
export function resolvePlaybackURL(video = {}) {
  const { encodings = [] } = video;

  let playbackURL = '';

  const keys = Object.keys(encodings);
  const values = Object.values(encodings);
  for (let i = 0; i <= keys.length; i += 1) {
    if (values[i] && values[i].formatName) {
      if (values[i].formatName === 'mpeg4_1_HLSMBRStreaming') {
        playbackURL = values[i].url;
        break;
      } else if (values[i].formatName === 'mpeg4_500000_Download') {
        playbackURL = values[i].url.replace(/pdl.iphone.cnbc.com/, 'pdl-iphone-cnbc-com.akamaized.net');
      }
    }
  }

  playbackURL = playbackURL.replace(/^https?:/, '');
  return playbackURL;
}

/**
 * @desc Check for the video status. returns "Restricted"/"Unrestricted"
 * @returns string
 */
export function resolveVideoStatus(settings = {}) {
  if (isPremium(settings)) return 'Restricted';
  return 'Unrestricted';
}

/**
 * @returns date string formatted by "MM/DD/YYYY"
 */
export function resolveAirDate(datePublished) {
  if (datePublished) {
    const date = new Date(datePublished);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
  return 'NA';
}

/**
@desc Checks for the usage rule returns "premium"/"native"/"NA"
@returns string
 */
export function resolveUsageRule(settings = {}) {
  if (isPremium(settings)) return 'premium';
  if (isNative(settings)) return 'native';
  return 'NA';
}

/**
 * Generates additional JSON to be appended to response for use with adding chapter timepoints
 * to JW Player.
 * @param {object} chapters
 * @returns {object}
 */
function generateVideoCues(chapters) {
  const cues = chapters.map(chapter => ({
    begin: chapter.in,
    text: chapter.title,
  }));
  return cues;
}

/**
 * Returns formatted transcript/paragraph data
 * @param {object} transcript
 * @returns {object}
*/
function getTranscript(transcript) {
  return Array.isArray(transcript) ? transcript.map(transcriptItem => ({
    in: transcriptItem.in,
    title: transcriptItem.title,
  })) : [];
}

/**
 * Generates chapters and transcript JSON to be appended
 * to response for use with the transcript player
 * to JW Player.
 * @param {object} transcripts
 * @returns {object}
 */
export function formatChaptersAndTranscripts(transcripts, chapterTranscript = true) {
  const formattedTranscripts = {
    duration: transcripts.duration,
    chapters: [],
  };
  formattedTranscripts.chapters = transcripts.chapter.map((chapter) => {
    const chapterItem = {
      in: chapter.in,
      out: chapter.out,
      title: chapter.title,
      chapter: chapter.chapter,
      keyChapter: chapter.keyChapter,
      transcript: chapterTranscript ? getTranscript(chapter.transcript) : [],
    };
    return chapterItem;
  });
  return { ...formattedTranscripts, cues: generateVideoCues(formattedTranscripts.chapters) };
}

export function resolvePlayerConfig(videoResponse) {
  let playerConfigByType = {};
  const {
    settings,
    branding,
    vcpsId,
    url,
    subType,
  } = videoResponse;

  const cloneConfig = cloneDeep(playerConfig.defaultPlayerConfig);
  if (settings && settings.premium === 'Yes') {
    playerConfigByType = merge(cloneConfig, playerConfig.premiumConfig);
  } else if (branding === 'buffett' && subType === 'full_length') {
    playerConfigByType =
      merge(cloneConfig, playerConfig.buffettLongFormConfig);
  } else if (branding === 'buffett' && subType === 'clips') {
    playerConfigByType =
      merge(cloneConfig, playerConfig.buffettVODConfig);
  } else {
    playerConfigByType =
      merge(cloneConfig, playerConfig.inlineConfig);
  }


  playerConfigByType.playbackRateControls = branding === 'buffett';
  playerConfigByType.fwassetId = playerConfigByType.fwassetId.replace('{VID}', vcpsId);
  playerConfigByType.mediaid = playerConfigByType.mediaid.replace('{VID}', vcpsId);
  playerConfigByType.embed = playerConfigByType.embedURL
    ? `<iframe width=560 height=349 src=${playerConfigByType.embedURL.replace('{VID}', vcpsId)} frameborder=0 scrolling=no allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen ></iframe>`
    : null;

  if (playerConfigByType.sharing && playerConfigByType.sharing.sites) {
    playerConfigByType.sharing.link = url;
    playerConfigByType.sharing.code = branding !== 'buffett' ? playerConfigByType.embed : null;
  }

  return {
    ...playerConfigByType,
  };
}

export function resolveVideoWithTranscript(videoResponse, chapterTranscript) {
  const videoResponseWithTranscript = {
    ...videoResponse,
    transcript: formatChaptersAndTranscripts(videoResponse.videoTranscript, chapterTranscript),
  };
  return videoResponseWithTranscript;
}

export function resolveComScoreC4(branding, settings = {}) {
  if (isPremium({ settings })) {
    return 'CNBC.com PRO';
  } else if (branding === 'buffett') {
    return 'CNBC.com Buffett VOD';
  } else if (branding === 'makeit') {
    return 'CNBC.com Make It VOD';
  } else if (branding === 'dealornodeal') {
    return 'CNBC.com Deal Or No Deal VOD';
  }
  return 'CNBC.com VOD';
}

export function resolveComScoreC6() {
  return '*null';
}
