import { AuthorizationBuilder } from '../../service/authorization-builder';
import LambdaAuthorizerResponseFactory from './lambda-authorizer-response-factory';

export default class AuthorizationBuilderFactory {
  static create(): Partial<AuthorizationBuilder> {
    return {
      build: jest.fn(() => LambdaAuthorizerResponseFactory.createValid()),
    };
  }
}
