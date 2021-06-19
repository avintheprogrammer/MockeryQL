import globalAppConfig from '../app/PhoenixQlConfig';

const { EMBED_PLAYER_URL } = globalAppConfig.getProperties();

export const defaultPlayerConfig = {
  autoPlay: false,
  workflow: 'VOD',
  sticky: true,
  endCard: false,
  embedURL: `${EMBED_PLAYER_URL}?playertype=synd&byGuid={VID}`,
  hlshtml: true,
  primary: 'html5',
  share: true,
  parsely: true,
  playbackRateControls: false,
  fwassetId: 'cnbc_{VID}',
  mediaid: 'cnbc_{VID}',
  key: 'kUNttoq2/4rWpvnQfp8li9YuepHLyGaDTdYfyFRSQAx2uiaN',
  playList: false,
  sharing: {
    sites: ['facebook', 'twitter', 'linkedin'],
  },
  mobileSFID: '7003948',
  IE11Profile: '169843:nbcu_web_flash_cs_moat_https',
  advertising: {
    client: 'freewheel',
    creativeTimeout: 4000,
    requestTimeout: 4000,
    vpaidcontrols: true,
    freewheel: {
      sectionid: 'cnbc_inline_vod',
      networkid: 169843,
      profileid: '169843:nbcu_mobileweb_js_cs_moat_https',
      adManagerURL: 'https://mssl.fwmrm.net/p/vitest-js/AdManager.js',
      serverid: '//29773.v.fwmrm.net/ad/p/1',
      sfid: '7006049',
      afid: '137705375',
      custom: {
        metr: '1023',
      },
    },
    schedule: {
      adbreak: {
        offset: 'pre',
        tag: 'placeholder_preroll',
      },
    },
  },
  analytics: {
    onSite: true,
    omniture: {
      playername: 'JW_Player',
      playerversion: 'Universal',
      daypart: 'Others',
      assetstatus: 'Unrestricted',
      videoprogram: {
        live: 'iconic',
      },
      videocontent: 'Linear',
      title: '{partnername} Vod',
      guid: '{partnername} Vod',
      share: {
        linksharepev2: 'Video Control Rack',
        providerepev2: 'Share',
        eVar15: 'Video:Vod:',
        linktrknav: 'video:share:Vod:',
        eVar14: ': Share Published',
      },
    },
  },
};

export const inlineConfig = {
  endCard: {
    timer: 5,
  },
};

export const buffettVODConfig = {
  advertising: false,
  sectionid: 'cnbc_buffett_vod',
  embedURL: null,
};

export const buffettLongFormConfig = {
  advertising: false,
  sectionid: 'cnbc_buffett_long_form_vod',
  embedURL: null,
};

export const homePageConfig = {
  advertising: {
    freewheel: {
      sectionid: 'cnbc_inline_homepage_vod',
    },
  },
  autoPlay: false,
};

export const xfinityConfig = {
  advertising: {
    freewheel: {
      sectionid: 'cnbc_xfinitycobrand_embed_vod',
    },
  },
};

export const premiumConfig = {
  advertising: {
    freewheel: {
      sectionid: 'premium_no_ads_vod',
    },
  },
};

export const quoteConfig = {
  advertising: {
    freewheel: {
      sectionid: 'cnbc_quote_vod',
    },
  },
};

export const syndicationConfig = {
  advertising: {
    freewheel: {
      sectionid: 'cnbc_off_domain_embed_vod',
    },
  },
};

export const playlistConfig = {
  autoPlayNextVideo: true,
};
