
import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFieldsWithoutTranscript = `
  id
  type
  brand
  datePublished
  dateLastPublished
  dateModified
  description
  slug
  headline
  url
  publisher {
    name
    logo
  }
  show
  usagePlans
  encodings {
    url
    bitrate
    encodingFormat
    formatName
  }
  duration
  uploadDate
  playbackURL
  vcpsId
  relatedTags {
    id
    type
    url
  }
`;

const queryableFieldsWithTranscript = `
  playbackURL
  duration
  transcript {
    duration
    cues
    chapters {
      transcript
      in
      out
      title
      chapter
      keyChapter
    }
  }
`;

describe('should return all of a video\'s queryable fields when transcripts are not requested', () => {
  const id = 104846487;
  const CAPIVideoMock = require(`./mocks/capi/${id}.json`);
  const PhoenixQLVideoMock = require(`./mocks/video/${id}.json`);

  it('should return the fields by id', async () => {
    nock(nockHost)
      .get(new RegExp(`/id/${id}?.*`))
      .reply(200, CAPIVideoMock);

    const query = `
    {
      video(id: ${id}) {
        ${queryableFieldsWithoutTranscript}
      }
    }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(PhoenixQLVideoMock);
  });

  it('should return correct player section id in desktop', async () => {
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIVideoMock);

    const query = `
    {
      video(id: ${id}) {
        playerConfig
      }
    }`;

    const resp = await graphql(Schema, query, {}, createContext());
    const sectionId = 'cnbc_inline_vod';
    expect(resp.data.video.playerConfig.advertising.freewheel.sectionid).toEqual(sectionId);
  });

  it('should return embed Markup', async () => {
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIVideoMock);

    const query = `
    {
      video(id: ${id}) {
        playerConfig
      }
    }`;

    const resp = await graphql(Schema, query, {}, createContext());
    const embedMock = '<iframe width=560 height=349 src=https://player.cnbc.com/p/gZWlPC/cnbc_global_qa?playertype=synd&byGuid=3000671746 frameborder=0 scrolling=no allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen ></iframe>';
    expect(resp.data.video.playerConfig.embed).toEqual(embedMock);
  });
});

describe('Buffett video', () => {
  const id = 104847766;
  const CAPIVideoMock = require(`./mocks/capi/buffett/${id}.json`);
  // const PhoenixQLVideoMock = require(`./mocks/video/buffett/${id}.json`);

  it('should return correct video playback URL', async () => {
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIVideoMock);

    const query = `
    {
      video(id: ${id}) {
        playbackURL
      }
    }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    const playbackURLMock = '//cnbcmbr-vh.akamaihd.net/i/mp4/VCPSQA/Y2002/M02D23/5000001400/918c56a0-18de-11e8-8d8c-df7bf34d9dc6/2002-BAM-1_MBR_,0240,0300,0500,0700,0900,1300,1700,.mp4.csmil/master.m3u8';
    expect(resp.data.video.playbackURL).toEqual(playbackURLMock);
  });

  it('should return correct video passthrough playback URL', async () => {
    const CAPIVideoMockPass = require(`./mocks/capi/buffett/${id}_encodings_pass.json`);
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIVideoMockPass);

    const query = `
    {
      video(id: ${id}) {
        playbackURL
      }
    }
    `;

    const resp = await graphql(Schema, query, {}, createContext());

    const playbackURLMock = '//pdl-iphone-cnbc-com.akamaized.net/VCPSQA/Y2002/M02D23/5000001400/2002-BAM-1_L.mp4';
    expect(resp.data.video.playbackURL).toEqual(playbackURLMock);
  });

  it('should return correct video MBR playback URL', async () => {
    const CAPIVideoMockPass = require(`./mocks/capi/buffett/${id}_encodings_order_1.json`);
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIVideoMockPass);

    const query = `
    {
      video(id: ${id}) {
        playbackURL
      }
    }
    `;

    const resp = await graphql(Schema, query, {}, createContext());

    const playbackURLMock = '//cnbcmbr-vh.akamaihd.net/i/mp4/VCPSQA/Y2002/M02D23/5000001400/918c56a0-18de-11e8-8d8c-df7bf34d9dc6/2002-BAM-1_MBR_,0240,0300,0500,0700,0900,1300,1700,.mp4.csmil/master.m3u8';
    expect(resp.data.video.playbackURL).toEqual(playbackURLMock);
  });

  it('should return correct player section id in desktop', async () => {
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIVideoMock);

    const query = `
    {
      video(id: ${id}) {
        playerConfig
      }
    }`;

    const resp = await graphql(Schema, query, {}, createContext());
    const sectionId = 'cnbc_buffett_long_form_vod';
    expect(resp.data.video.playerConfig.sectionid).toEqual(sectionId);
  });

  it('should return embed NULL', async () => {
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIVideoMock);

    const query = `
    {
      video(id: ${id}) {
        playerConfig
      }
    }`;

    const resp = await graphql(Schema, query, {}, createContext());
    const embed = null;
    expect(resp.data.video.playerConfig.embed).toEqual(embed);
  });

  it('should return Correct Sharing Sites', async () => {
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIVideoMock);

    const query = `
    {
      video(id: ${id}) {
        playerConfig
      }
    }`;

    const resp = await graphql(Schema, query, {}, createContext());
    const sharingSites = {
      sites: [
        'facebook',
        'twitter',
        'linkedin',
      ],
      link: 'https://qa-aws03buffett.cnbc.com/video/2002/02/23/buffett-annual-meeting-2002-morning-session.html',
      code: null,
    };
    expect(resp.data.video.playerConfig.sharing).toEqual(sharingSites);
  });

  it('should return Advertising FALSE', async () => {
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIVideoMock);

    const query = `
    {
      video(id: ${id}) {
        playerConfig
      }
    }`;

    const resp = await graphql(Schema, query, {}, createContext());
    const advertising = false;

    expect(resp.data.video.playerConfig.advertising).toEqual(advertising);
  });
});

describe('should return all of a video\'s queryable fields when transcripts are requested', () => {
  const id = 104847483;
  const CAPIVideoMock = require(`./mocks/capi/${id}.json`);
  const PhoenixQLVideoMock = require(`./mocks/video/${id}.json`);

  it('should return the fields by id', async () => {
    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .query({ includeTranscript: 'true' })
      .reply(200, CAPIVideoMock);

    const query = `
    {
      video(id: ${id}, transcripts: true) {
        ${queryableFieldsWithTranscript}
      }
    }
    `;

    const resp = await graphql(Schema, query, {}, createContext());

    expect(resp).toEqual(PhoenixQLVideoMock);
  });
});
