import { articleQuery as article, articleSubtypeQueries } from './article';
import articleTicker from './articleTicker';
import asset from './asset';
import assetList from './assetList';
import buffettQuote from './buffettQuote';
import collection from './collection';
import company from './company';
import creator from './creator';
import event from './event';
import image from './image';
import livestream from './livestream';
import marketBanner from './marketBanner';
import mediaLabsSearch from './mediaLabsSearch';
import mediaLabsContent from './mediaLabsContent';
import menu from './menu';
import mostPopular from './mostPopular';
import newsAlert from './newsAlert';
import page from './page';
import person from './person';
import section from './section';
import sections from './sections';
import security from './security';
import tag from './tag';
import mostPopularQuotes from './mostPopularQuotes';
import video from './video';
import videoRecommendations from './videoRecommendations';
import videos from './videos';
import webresource from './webresource';
import webservice from './webservice';
import wildcard from './wildcard';
import search from './search';

export default {
  ...articleSubtypeQueries,
  article,
  articleTicker,
  asset,
  assetList,
  buffettQuote,
  collection,
  company,
  creator,
  event,
  image,
  livestream,
  marketBanner,
  mediaLabsSearch,
  mediaLabsContent,
  menu,
  mostPopular,
  newsAlert,
  page,
  person,
  section,
  sections,
  security,
  tag,
  mostPopularQuotes,
  video,
  videoRecommendations,
  videos,
  webresource,
  webservice,
  wildcard,
  search,
};
