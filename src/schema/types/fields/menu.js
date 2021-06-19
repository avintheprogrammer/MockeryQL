import GraphQLJSON from 'graphql-type-json';

export default () => ({
  header: {
    type: GraphQLJSON,
  },
  footer: {
    type: GraphQLJSON,
  },
});
