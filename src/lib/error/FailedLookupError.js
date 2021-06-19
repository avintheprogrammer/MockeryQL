import { GraphQLError } from 'graphql';

class FailedLookupError extends GraphQLError {
  constructor(err) {
    super(err);
    this.message = 'Failed Lookup Error';
    this.failedData = err.failedData;
  }
}

export default FailedLookupError;
