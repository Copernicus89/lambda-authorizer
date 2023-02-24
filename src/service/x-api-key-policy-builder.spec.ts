import { ArnHandler } from '../aws/arn-handler';
import { HttpHeader } from '../http/http-header';
import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';

import LambdaAuthorizerResponse from '../model/lambda-authorizer-response';
import PolicyResponseFactory from '../test/factory/policy-response-factory';
import { XApiKeyPolicyBuilder } from './x-api-key-policy-builder';

jest.mock('../aws/arn-handler');

describe('XApiKeyPolicyBuilder', () => {
  const X_API_KEY = 'xApiKey';
  const METHOD_ARN = 'arn:aws:execute-api:*:awsAccountId';
  const AWS_ACCOUNT_ID = 'awsAccountId';

  let builder: XApiKeyPolicyBuilder;

  let event: Partial<APIGatewayRequestAuthorizerEvent>;

  beforeEach(() => tearUp());

  it('method build should return a policy object', () => {
    const result = builder.build();

    const allowedPolicy = PolicyResponseFactory.createAllowed(X_API_KEY, AWS_ACCOUNT_ID, METHOD_ARN);
    const allowedAuthorizationResponse: LambdaAuthorizerResponse = {
      ...allowedPolicy,
      usageIdentifierKey: X_API_KEY,
    };

    expect(result).toEqual(allowedAuthorizationResponse);
  });

  it('method build should return error if not apikey found in header', () => {
    const builderError = XApiKeyPolicyBuilder.create({} as APIGatewayRequestAuthorizerEvent);

    expect(() => builderError.build()).toThrow('Error apikey expected!');
  });

  function tearUp(): void {
    createMocks();
    initPropertiesForTesting();
  }

  function createMocks(): void {
    jest.spyOn(ArnHandler, 'getAWSAccountId').mockReturnValue(AWS_ACCOUNT_ID);
  }

  function initPropertiesForTesting(): void {
    event = {
      headers: {
        [HttpHeader.XAPIKEY]: X_API_KEY,
      },
      methodArn: METHOD_ARN,
    };

    builder = XApiKeyPolicyBuilder.create(event as APIGatewayRequestAuthorizerEvent);
  }
});
