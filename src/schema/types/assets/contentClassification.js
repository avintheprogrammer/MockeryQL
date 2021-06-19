import { GraphQLEnumType } from 'graphql';

export default new GraphQLEnumType({
  name: 'contentClassificationValues',
  values: {
    native: { value: 'native' },
    liveblog: { value: 'liveblog' },
    prime: { value: 'prime' },
    premium: { value: 'premium' },
    pro: { value: 'pro' },
    notfamilyfriendly: { value: 'notfamilyfriendly' },
    webexclusive: { value: 'webexclusive' },
    nativeweb: { value: 'nativeweb' },
    premiumweb: { value: 'premiumweb' },
    cnbconly: { value: 'cnbconly' },
    donotsyndicate: { value: 'donotsyndicate' },
  },
});
