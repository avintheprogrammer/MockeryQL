import { GraphQLObjectType } from 'graphql';
import TransporterSectionFields from '../fields/transporterSection';

export default new GraphQLObjectType({
  name: 'transporterSection',
  fields: TransporterSectionFields,
});
