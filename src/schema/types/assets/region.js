import { GraphQLEnumType } from 'graphql';

export default new GraphQLEnumType({
  name: 'region',
  values: {
    USA: { value: 'USA' },
    WORLD: { value: 'WORLD' },
  },
});
