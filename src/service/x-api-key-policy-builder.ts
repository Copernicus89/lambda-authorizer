import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { HttpHeader } from '../http/http-header';
import { AuthPolicy } from '../auth/auth-policy';
import { ArnHandler } from '../aws/arn-handler';
import LambdaAuthorizerResponse from '../model/lambda-authorizer-response';

export class XApiKeyPolicyBuilder {
  static create(event: APIGatewayRequestAuthorizerEvent): XApiKeyPolicyBuilder {
    return new XApiKeyPolicyBuilder(event);
  }

  private constructor(public event: APIGatewayRequestAuthorizerEvent) {
    this.event = event;
  }

  build(): LambdaAuthorizerResponse {
    const xApiKey = this.getHeader();
    const awsAccountId = ArnHandler.getAWSAccountId(this.event);
    const apiOptions = {};
    const authPolicy = new AuthPolicy(xApiKey as string, awsAccountId, apiOptions);

    authPolicy.allowAllMethods();
    authPolicy.allowResourceArn(this.event.methodArn);

    const policy = authPolicy.build();

    policy.usageIdentifierKey = xApiKey;

    return policy;
  }

  private getHeader(): string | undefined {
    const headers = this.event.headers;

    if (!headers) {
      throw new Error('Error apikey expected!');
    }

    return headers[HttpHeader.XAPIKEY];
  }
}
