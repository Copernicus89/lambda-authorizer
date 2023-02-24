import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import AuthorizationBuilderFactory from '../test/factory/authorization-builder-factory';
import LambdaAuthorizerResponseFactory from '../test/factory/lambda-authorizer-response-factory';
import AuthorizationBuilderService from './authorization-builder-service';
import { AuthorizationBuilder } from './authorization-builder';

jest.mock('./authorization-builder');

describe('AuthorizationBuilderService', () => {
  let builderService: AuthorizationBuilderService;

  let event: Partial<APIGatewayRequestAuthorizerEvent>;

  const expectedPolicy = LambdaAuthorizerResponseFactory.createValid();

  beforeEach(() => tearUp());

  afterEach(() => tearDown());

  it('should use the AuthorizationBuilder', () => {
    const authorizationBuilder = AuthorizationBuilderFactory.create();
    jest.spyOn(AuthorizationBuilder, 'create').mockReturnValue(authorizationBuilder as AuthorizationBuilder);

    builderService = AuthorizationBuilderService.create(event as APIGatewayRequestAuthorizerEvent, expectedPolicy);

    const policy = builderService.build();

    expect(policy).toEqual(expectedPolicy);
    expect(authorizationBuilder.build).toHaveBeenCalled();
  });

  function tearUp(): void {
    initPropertiesForTesting();
  }

  function initPropertiesForTesting(): void {
    event = {};
  }

  function tearDown() {
    jest.resetAllMocks();
  }
});
