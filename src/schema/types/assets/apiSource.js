import { GraphQLEnumType } from 'graphql';

export default new GraphQLEnumType({
  name: 'apiSources',
  values: {
    parsely: { value: 'PARSELY' },
    dynamicYield: { value: 'DYNAMIC_YIELD' },
  },
});
