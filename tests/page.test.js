import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';

const queryableFields = `
  id,
  brand,
  native,
  premium,
  template,
  seoTitle,
  layout {
    editable
    columns {
      span
      editable
      modules {
        name
        source
        canChangeLayout
        canChangeSource
        serverRenderPolicy
      }
    }
  }
  tagName,
  liveURL,
  projectTeamContent {
    id,
    headline,
    tagName
  },
  relatedTags: relatedTagsFiltered {
    id,
    headline,
    tagName,
    type
  },
  additionalSectionContent {
    id,
    headline,
    tagName,
    type
  },
  relatedContent: relatedContentFiltered {
    id,
    headline,
    tagName,
    type
  },
  sectionHierarchy {
    id,
    tagName,
    order
  },
  creatorOverwrite,
  projectContent {
    id,
    headline,
    tagName
  },
  pageName
  shortDatePublished
  shortDateLastPublished
  shortDateFirstPublished
`;

describe('Page', () => {
  describe('should return all of a page\'s queryable fields', () => {
    const id = '104846992';
    const CAPINewsStoryMock = require(`./mocks/capi/${id}.json`);
    const PCMPageMock = require(`./mocks/pcm/page/${id}.json`);
    const PhoenixQLPageMock = require(`./mocks/page/${id}.json`);
    const path = '/2017/10/12/use-caution-before-joining-bitcoin-frenzy.html';

    it('should return the fields by id', async () => {
      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPINewsStoryMock);

      nock(nockHost)
        .get(new RegExp('/page?.*'))
        .reply(200, PCMPageMock);

      const query = `
        query {
          page(id: ${id}) {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(PhoenixQLPageMock);
    });

    it('should return the fields by path', async () => {
      nock(nockHost)
        .get(`/url/${encodeURIComponent(path)}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPINewsStoryMock);

      nock(nockHost)
        .get(new RegExp('/page?.*'))
        .reply(200, PCMPageMock);

      const query = `
        query {
          page(path: "${path}") {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(PhoenixQLPageMock);
    });
  });

  it('should return the modules with data if queried for', async () => {
    const id = '104847371';
    const CAPIBuffettPageMock = require(`./mocks/capi/buffett/${id}.json`);
    const PCMBuffettPageMock = require(`./mocks/pcm/page/${id}.json`);
    const CAPIModuleDataMock = require(`./mocks/capi/${id}/listId.json`);
    const PhoenixQLBuffettPageMock = require(`./mocks/page/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIBuffettPageMock);

    nock(nockHost)
      .get(new RegExp('/page?.*'))
      .reply(200, PCMBuffettPageMock);

    nock(nockHost)
      .get(new RegExp(`/list/id/${id}?.*`))
      .reply(200, CAPIModuleDataMock)
      .persist();

    const query = `
      query {
        page(id: ${id}) {
          layout {
            columns {
              span
              editable
              modules {
                name
                source
                canChangeLayout
                canChangeSource
                serverRenderPolicy
                data {
                  ... on storiesTwoThird {
                    id
                    relatedTags {
                      id
                    }
                    assets {
                      id
                    }
                  }
                  ... on threeUp {
                    id
                    relatedTags {
                      id
                    }
                    assets {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(PhoenixQLBuffettPageMock);
  });

  it('should return the modules with a different template variant', async () => {
    const id = '104847371';
    const CAPIBuffettPageMock = require(`./mocks/capi/buffett/${id}.json`);
    const PCMBuffettPageMock = require(`./mocks/pcm/page/${id}.json`);
    const CAPIModuleDataMock = require(`./mocks/capi/${id}/listId.json`);
    const PhoenixQLBuffettPageMock = require(`./mocks/page/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIBuffettPageMock);

    nock(nockHost)
      .get(new RegExp('/page?.*'))
      .reply(200, PCMBuffettPageMock);

    nock(nockHost)
      .get(new RegExp(`/list/id/${id}?.*`))
      .reply(200, CAPIModuleDataMock)
      .persist();

    const query = `
      query {
        page(id: ${id}, templateVariant: 2) {
          layout {
            columns {
              span
              editable
              modules {
                name
                source
                canChangeLayout
                canChangeSource
                serverRenderPolicy
                data {
                  ... on storiesTwoThird {
                    id
                    relatedTags {
                      id
                    }
                    assets {
                      id
                    }
                  }
                  ... on threeUp {
                    id
                    relatedTags {
                      id
                    }
                    assets {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(PhoenixQLBuffettPageMock);
  });
});
