import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import LambdaAuthorizerResponse from '../model/lambda-authorizer-response';

export class AuthorizationBuilder {
  private constructor(public event: APIGatewayRequestAuthorizerEvent, public authorizerResponse: LambdaAuthorizerResponse) {
    this.event = event;
    this.authorizerResponse = authorizerResponse;
  }

  static create(event: APIGatewayRequestAuthorizerEvent, authorizerResponse: LambdaAuthorizerResponse): AuthorizationBuilder {
    return new AuthorizationBuilder(event, authorizerResponse);
  }

  public build(): LambdaAuthorizerResponse {
    return this.setAuthHeader(process.env.HEADER_AUTHORIZATION as string);
  }

  private setAuthHeader(headerAuthentication: string): LambdaAuthorizerResponse {
    this.authorizerResponse.context = {
      authHeader: headerAuthentication,
    };
    return this.authorizerResponse;
  }
}
