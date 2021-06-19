import { GraphQLError } from 'graphql';

class RequestError extends GraphQLError {
  constructor(err) {
    super(err);
    this.message = err.message;
    this.statusCode = err.statusCode;
  }
}

export default RequestError;
