import { GraphQLEnumType } from 'graphql';

export default new GraphQLEnumType({
  name: 'product',
  values: {
    web: { value: 'web' },
    iOS: { value: 'iOS' },
  },
});
