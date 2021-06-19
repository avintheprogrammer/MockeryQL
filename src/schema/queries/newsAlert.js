import { GraphQLNonNull } from 'graphql';
import NewsAlertType from '../types/assets/newsAlert';
import { BrandValues, BrandType } from '../types/assets/brand';
import ProductType from '../types/assets/product';

export default {
  type: NewsAlertType,
  args: {
    brand: {
      type: BrandType,
      defaultValue: BrandValues.cnbc.value,
    },
    product: {
      type: new GraphQLNonNull(ProductType),
    },
  },
  resolve(_, { brand, product }, { stores }) {
    return stores.newsAlert.find({ brand, product });
  },
};
