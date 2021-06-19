import { GraphQLString, GraphQLInt } from 'graphql';
import Page from '../types/assets/page';
import Product from '../types/assets/product';

export default {
  type: Page,
  args: {
    id: { type: GraphQLInt },
    path: { type: GraphQLString },
    product: { type: Product },
    hostname: { type: GraphQLString },
    mode: { type: GraphQLString },
    templateVariant: { type: GraphQLInt },
  },
  resolve: async (_, args, context) => {
    const { stores } = context;

    const data = await stores.page.find(args) || {};

    const { contentOverride } = data || {};
    context.contentOverride = contentOverride; // eslint-disable-line

    return data;
  },
};
