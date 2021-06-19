/* eslint-disable import/prefer-default-export */
import createStores from '../src/store';

export const nockHost = /(\.com|localhost)/;
export const createContext = () => ({ stores: createStores() });
