import { GraphQLNonNull } from 'graphql';
import Menu from '../types/assets/menu';
import Brand from '../types/assets/brand';
import Product from '../types/assets/product';
import Region from '../types/assets/region';

export default {
  type: Menu,
  args: {
    brand: { type: new GraphQLNonNull(Brand) },
    product: { type: new GraphQLNonNull(Product) },
    region: { type: Region },
  },
  resolve(_, args, { stores }) {
    return stores.menu.find(args);
  },
};
