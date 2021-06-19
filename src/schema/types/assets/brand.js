import { GraphQLEnumType } from 'graphql';

export const BrandValues = {
  buffett: { value: 'buffett' },
  cnbc: { value: 'cnbc' },
  dealornodeal: { value: 'dealornodeal' },
  makeit: { value: 'makeit' },
};

export const BrandType = new GraphQLEnumType({
  name: 'brand',
  values: BrandValues,
});

export default BrandType;
