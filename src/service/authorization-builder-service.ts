import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import LambdaAuthorizerResponse from '../model/lambda-authorizer-response';
import { AuthorizationBuilder } from './authorization-builder';

export default class AuthorizationBuilderService {
  static create(event: APIGatewayRequestAuthorizerEvent, authorizerResponse: LambdaAuthorizerResponse): AuthorizationBuilderService {
    return new AuthorizationBuilderService(event, authorizerResponse);
  }

  private builder: AuthorizationBuilder;

  private constructor(event: APIGatewayRequestAuthorizerEvent, authorizerResponse: LambdaAuthorizerResponse) {
    this.builder = AuthorizationBuilder.create(event, authorizerResponse);
  }

  build(): LambdaAuthorizerResponse {
    return this.builder.build();
  }
}
