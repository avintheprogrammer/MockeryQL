import { ArticleType as article, ArticleSubtypes } from './article';
import {
  Asset as asset,
  AssetTypeValuesType as assetTypeValues,
} from './asset';
import assetList from './assetList';
import body from './body';
import brand from './brand';
import collection from './collection';
import chapter from './chapter';
import creator from './creator';
import encoding from './encoding';
import event from './event';
import featuredMediaInterface from './featuredMedia';
import franchise from './franchise';
import highlight from './highlight';
import image from './image';
import market from './market';
import marketBanner from './marketBanner';
import menu from './menu';
import navigation from './navigation';
import newsAlert from './newsAlert';
import page from './page';
import pagination from './pagination';
import person from './person';
import product from './product';
import publisher from './publisher';
import quote from './quote';
import search from './search';
import security from './security';
import socialMediaInfo from './socialMediaInfo';
import source from './source';
import tag from './tag';
import team from './team';
import transcript from './transcript';
import video from './video';
import webresource from './webresource';
import webservice from './webservice';
import wildcard from './wildcard';

export default {
  article,
  ...ArticleSubtypes,
  asset,
  assetTypeValues,
  assetList,
  body,
  brand,
  collection,
  chapter,
  creator,
  event,
  encoding,
  featuredMediaInterface,
  franchise,
  highlight,
  image,
  market,
  marketBanner,
  menu,
  navigation,
  newsAlert,
  page,
  pagination,
  person,
  product,
  publisher,
  quote,
  search,
  security,
  socialMediaInfo,
  source,
  tag,
  team,
  transcript,
  video,
  webresource,
  webservice,
  wildcard,
};
