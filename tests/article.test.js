import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';
import { nockHost, createContext } from './helpers';
import authSuccess from './mocks/proAuthentication/success.json';
import authFail from './mocks/proAuthentication/fail.json';
import articleTypes from './../src/config/articleTypes.json';

const queryableFields = `
  id
  type
  url
  summary
  outbrainEnabled
  commentsEnabled
  dateline
  displayByline
  displaySource
  datePublishedFormatted
  dateLastPublishedFormatted
  dateLastPublishedSixHr
  socialtoolsEnabled
  listType
  tweetOnPublish
  shorterDescription
  brand
  slug
  creatorOverwrite
  headline
  title
  description
  premium
  native
  body {
    content {
      tagName
      attributes
      children
    }
  }
  keyPoints
  relatedContent {
    id
    type
    url
  }
  featuredMedia {
    ... on cnbcvideo {
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
      usagePlans
      show
      expireDate
      encodings {
        url
        encodingFormat
        bitrate
      }
    }
    ... on image {
      id
      type
      isPromoted
      isHighTouch
      creatorOverwrite
      contentSize
      caption
      filter
      height
      width
      url
      datePublished
      dateModified
      dateLastPublished
      publisher {
        name
        logo
      }
      focalPoints {
        x
        y
        height
        width
      }
      copyrightHolder
      slug
      description
    }
  }
  promoImage {
    id
    type
    contentSize
  }
  datePublished
  dateModified
  publisher {
    name
    logo
  }
  section {
    id
    color
    name
    url
    image {
      url
    }
    logo {
      url
    }
    headerImage {
      url
    }
  }
  relatedTags {
    id
    name
    url
  }
  author {
    id
    url
    name
    image
    sameAs
    socialMediaInfo {
      url
      displayText
      type
    }
  }
  sourceOrganization {
    id
    type
    slug
    contentUrl
    url
    description
    logo
    name
    creatorOverwrite
  }
  sectionHierarchy {
    id
    tagName
    order
  }
`;

describe('Article', () => {
  describe('should return all of an article\'s queryable fields', () => {
    const id = 104757404;
    const url = '/2017/10/06/money-in-the-banks-financials-stocks-rocket-to-pre-crisis-levels.html';
    const CAPIArticleMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLArticleMock = require(`./mocks/article/${id}.json`);

    it('should return the fields by id', async () => {
      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIArticleMock);

      const query = `
        query {
          article(id: ${id}) {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLArticleMock));
    });

    it('should return the fields by url', async () => {
      nock(nockHost)
        .get(`/url/${encodeURIComponent(url)}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIArticleMock);

      const query = `
        query {
          article(url: "${url}") {
            ${queryableFields}
          }
        }
      `;

      const resp = await graphql(Schema, query, {}, createContext());
      expect(resp).toEqual(expect.objectContaining(PhoenixQLArticleMock));
    });
  });

  it('should return the related tags with a given length if a count argument is provided', async () => {
    const id = 104757404;
    const count = 5;
    const CAPIArticleMock = require(`./mocks/capi/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIArticleMock);

    const query = `
      query {
        article(id: ${id}) {
          relatedTags(count: ${count}) {
            id
          }
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    const { relatedTags } = resp.data.article;
    expect(relatedTags.length).toEqual(count);
  });

  it('should return null for an invalid input ID', async () => {
    const id = 10394451;
    const CAPIArticleMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLArticleMock = require(`./mocks/article/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIArticleMock);

    const query = `
      query {
        article(id: ${id}) {
          ${queryableFields}
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLArticleMock));
  });

  it('should ensure article subtype endpoints are properly working', async () => {
    const id = 104847235;
    const CAPIArticleMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLArticleMock = require(`./mocks/article/${id}.json`);

    articleTypes.forEach(() => {
      nock(nockHost)
        .get(`/id/${id}`)
        .query({ partner: 'pql01' })
        .reply(200, CAPIArticleMock);
    });

    const query = `
       query {
         blogpost(id:${id}) {
           id
         }
         partnerstory(id:${id}) {
           id
         }
         cnbcnewsstory(id:${id}) {
           id
         }
         pressrelease(id:${id}) {
           id
         }
         slideshow(id:${id}) {
           id
         }
         sponsored(id:${id}) {
           id
         }
         wirestory(id:${id}) {
           id
         }
       }
     `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLArticleMock));
  });

  it('should provide code coverage for embedded article assets', async () => {
    const id = 104847372;
    const CAPIArticleMock = require(`./mocks/capi/${id}.json`);
    const PhoenixQLArticleMock = require(`./mocks/article/${id}.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIArticleMock);

    const query = `
      query {
        article(id: ${id}) {
          body {
            content {
              tagName
              attributes
              children
            }
          }
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLArticleMock));
  });

  it('should provide ONLY free content in article body', async () => {
    const id = 104847749;
    const uid = '0a7aadff5ed247a9ba01cd91cb0107cb';
    const sessionToken = '8f1e42bdce0a2acdd1c994ad2e908aea8736ed7f';
    const isNewProUser = false;
    const CAPIArticleMock = require(`./mocks/capi/premiumArticle/${id}.json`);
    const PhoenixQLArticleMock = require(`./mocks/article/${id}-nonAuthenticated.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIArticleMock);

    nock(nockHost)
      .get(new RegExp(`${uid}/validateProUser?.*`))
      .reply(200, authFail);

    const query = `
      query {
        article(id: ${id}) {
          body(uid: "${uid}", sessionToken: "${sessionToken}", isNewProUser: ${isNewProUser}) {
            isAuthenticated
            content {
              tagName
              attributes
              children
            }
          }
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLArticleMock));
  });

  it('should provide premium content in article body', async () => {
    const id = 104847749;
    const uid = '0a7aadff5ed247a9ba01cd91cb0107cb';
    const sessionToken = '8f1e42bdce0a2acdd1c994ad2e908aea8736ed7f';
    const isNewProUser = true;
    const CAPIArticleMock = require(`./mocks/capi/premiumArticle/${id}.json`);
    const PhoenixQLArticleMock = require(`./mocks/article/${id}-authenticated.json`);

    nock(nockHost)
      .get(`/id/${id}`)
      .query({ partner: 'pql01' })
      .reply(200, CAPIArticleMock);

    nock(nockHost)
      .get(new RegExp(`${uid}/validateProUser?.*`))
      .reply(200, authSuccess);

    const query = `
      query {
        article(id: ${id}) {
          body(uid: "${uid}", sessionToken: "${sessionToken}", isNewProUser: ${isNewProUser}) {
            isAuthenticated
            content {
              tagName
              attributes
              children
            }
          }
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(PhoenixQLArticleMock));
  });
});
