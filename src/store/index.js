import * as ArticleStore from './article';
import * as ArticleTickerStore from './articleTicker';
import * as AssetListStore from './assetList';
import * as BuffettQuoteStore from './buffettQuote';
import * as BuffettTimelineStore from './buffettTimeline';
import * as CAPIStore from './capi';
import * as MarketBannerStore from './marketBanner';
import * as MediaLabsContentStore from './mediaLabsContent';
import * as MediaLabsSearchStore from './mediaLabsSearch';
import * as MenuStore from './menu';
import * as MostPopularStore from './mostPopular';
import * as NewsAlertStore from './newsAlert';
import * as PageStore from './page';
import * as SearchStore from './search';
import * as MostPopularQuotesStore from './mostPopularQuotes';
import * as VapiStore from './vapi';
import * as VideoStore from './video';

export default function createStores() {
  const capi = CAPIStore.createStore();

  const article = ArticleStore.createStore({ capi });
  const assetList = AssetListStore.createStore({ capi });
  const articleTicker = ArticleTickerStore.createStore({ capi, assetList });
  const buffettQuote = BuffettQuoteStore.createStore();
  const buffettTimeline = BuffettTimelineStore.createStore();
  const marketBanner = MarketBannerStore.createStore({ capi });
  const mediaLabsContent = MediaLabsContentStore.createStore({ capi });
  const mediaLabsSearch = MediaLabsSearchStore.createStore({ capi });
  const menu = MenuStore.createStore({ capi });
  const mostPopular = MostPopularStore.createStore({ capi });
  const newsAlert = NewsAlertStore.createStore({ capi });
  const page = PageStore.createStore({ capi });
  const search = SearchStore.createStore({ capi });
  const mostPopularQuotes = MostPopularQuotesStore.createStore();
  const vapi = VapiStore.createStore();
  const video = VideoStore.createStore({ capi });

  return {
    article,
    articleTicker,
    assetList,
    buffettQuote,
    buffettTimeline,
    capi,
    marketBanner,
    mediaLabsContent,
    mediaLabsSearch,
    menu,
    mostPopular,
    newsAlert,
    page,
    search,
    mostPopularQuotes,
    vapi,
    video,
  };
}
