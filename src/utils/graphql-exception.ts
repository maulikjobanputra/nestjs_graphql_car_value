import { GraphQLError } from 'graphql';

export class GraphQlException extends GraphQLError {
  constructor(message: string, statusCode: number, error: string) {
    super(message, { extensions: { statusCode, error } });
  }
}
