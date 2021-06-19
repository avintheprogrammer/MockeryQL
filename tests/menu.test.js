import nock from 'nock';
import { graphql } from 'graphql';
import Schema from '../src/schema';

import PCMMock from './mocks/pcm/menu/cnbc.json';
import MenuMock from './mocks/menu/cnbc.json';
import BuffettPCMMock from './mocks/pcm/menu/buffett.json';
import BuffettMenuMock from './mocks/menu/buffett.json';

import { nockHost, createContext } from './helpers';

describe('Menu', () => {
  it('should return a menu config for the given brand/product', async () => {
    const brand = 'cnbc';
    const product = 'web';

    // Mock initial PCM request for the static menu
    nock(nockHost)
      .get(`/menu/${brand}/${product}`)
      .query({ region: 'USA' })
      .query({ partner: 'pql01' })
      .reply(200, PCMMock);

    // Mock following CAPI requests for the dynamic menu
    ['104847365', '16903222', '103254088'].map(CAPIListID =>
      nock(nockHost)
        .get(`/list/id/${CAPIListID}`)
        .query({ partner: 'pql01' })
        .query({ promoted: 'true' })
        .reply(200, require(`./mocks/capi/${CAPIListID}.json`)));

    const query = `
      query {
        menu(brand: cnbc, product: web, region: USA) {
          header,
          footer
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(MenuMock));
  });

  it('should return a menu config for buffett brand', async () => {
    const brand = 'buffett';
    const product = 'web';

    // Mock initial PCM request for the static menu
    nock(nockHost)
      .get(`/menu/${brand}/${product}`)
      .query({ region: 'USA' })
      .query({ partner: 'pql01' })
      .reply(200, BuffettPCMMock);

    const query = `
      query {
        menu(brand: buffett, product: web) {
          header,
          footer
        }
      }
    `;

    const resp = await graphql(Schema, query, {}, createContext());
    expect(resp).toEqual(expect.objectContaining(BuffettMenuMock));
  });
});
