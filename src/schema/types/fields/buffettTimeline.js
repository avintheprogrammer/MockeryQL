import { GraphQLList } from 'graphql';
import slide from '../assets/slide';

export default () => ({
  slides: {
    type: new GraphQLList(slide),
  },
});
