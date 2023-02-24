import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import LambdaAuthorizerResponse from '../model/lambda-authorizer-response';
import LambdaAuthorizerResponseFactory from '../test/factory/lambda-authorizer-response-factory';
import { AuthorizationBuilder } from './authorization-builder';

describe('AuthorizationBuilder', () => {
  const POLICY: LambdaAuthorizerResponse = LambdaAuthorizerResponseFactory.createValid();

  const testHeaderAuthorization = 'Basic Test';

  const event: Partial<APIGatewayRequestAuthorizerEvent> = {};

  const response: LambdaAuthorizerResponse = LambdaAuthorizerResponseFactory.createValid();

  let builder: AuthorizationBuilder;

  beforeEach(() => tearUp());

  it('build method should return the policy', () => {
    const policy = builder.build();

    POLICY.context = {
      authHeader: testHeaderAuthorization,
    };

    expect(policy).toStrictEqual(POLICY);
  });

  function tearUp() {
    builder = AuthorizationBuilder.create(event as APIGatewayRequestAuthorizerEvent, response);
    process.env.HEADER_AUTHORIZATION = testHeaderAuthorization;
  }
});
