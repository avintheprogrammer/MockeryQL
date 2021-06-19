import { GraphQLObjectType } from 'graphql';
import SharedFields from '../fields/shared';

export default new GraphQLObjectType({
    name: 'pageTitle',
    fields: SharedFields,
});