import { GraphQLObjectType } from 'graphql';
import SettingsFields from '../fields/settings';

export default new GraphQLObjectType({
  name: 'settings',
  fields: SettingsFields,
});
