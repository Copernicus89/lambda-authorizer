import { APIGatewayRequestAuthorizerEvent, Context } from 'aws-lambda';
import { XApiKeyPolicyBuilder } from './service/x-api-key-policy-builder';

import { handler } from './index';
import AuthorizationBuilderService from './service/authorization-builder-service';
import LambdaAuthorizerResponseFactory from './test/factory/lambda-authorizer-response-factory';

jest.mock('./service/authorization-builder-service');

describe('handler', () => {
  const EVENT: Partial<APIGatewayRequestAuthorizerEvent> = {};
  const CONTEXT = {} as Context;

  let callback: any;
  let authorizationBuilderServiceMock: Partial<AuthorizationBuilderService>;
  let xApiKeyPolicyBuilderMock: Partial<XApiKeyPolicyBuilder>;

  const authorizerResponse = LambdaAuthorizerResponseFactory.createValid();

  beforeEach(() => tearUp());

  afterEach(() => tearDown());

  describe('when the AuthorizationBuilderService', () => {
    it('returns a policy should call the callback with it', () => {
      xApiKeyPolicyBuilderMock = {
        build: jest.fn(() => authorizerResponse),
      };
      jest.spyOn(XApiKeyPolicyBuilder, 'create').mockReturnValue(xApiKeyPolicyBuilderMock as XApiKeyPolicyBuilder);

      authorizationBuilderServiceMock = {
        build: jest.fn(() => authorizerResponse),
      };

      jest.spyOn(AuthorizationBuilderService, 'create').mockReturnValue(authorizationBuilderServiceMock as AuthorizationBuilderService);

      handler(EVENT as APIGatewayRequestAuthorizerEvent, CONTEXT, callback);

      expect(callback).toHaveBeenCalledWith(null, authorizerResponse);
    });

    it('throws an Error by XApiKeyPolicyBuilder should call the callback with it', () => {
      const exceptionMessage = 'theException';
      const exception = new Error(exceptionMessage);

      xApiKeyPolicyBuilderMock = {
        build: jest.fn(() => {
          throw exception;
        }),
      };
      jest.spyOn(XApiKeyPolicyBuilder, 'create').mockReturnValue(xApiKeyPolicyBuilderMock as XApiKeyPolicyBuilder);

      handler(EVENT as APIGatewayRequestAuthorizerEvent, CONTEXT, callback);

      expect(callback).toHaveBeenCalledWith('Unauthorized', null);
      expect(AuthorizationBuilderService.create).not.toHaveBeenCalled();
    });

    it('throws an Error by AuthorizationBuilderService should call the callback with it', () => {
      const exceptionMessage = 'theException';
      const exception = new Error(exceptionMessage);

      xApiKeyPolicyBuilderMock = {
        build: jest.fn(() => authorizerResponse),
      };
      jest.spyOn(XApiKeyPolicyBuilder, 'create').mockReturnValue(xApiKeyPolicyBuilderMock as XApiKeyPolicyBuilder);

      authorizationBuilderServiceMock = {
        build: jest.fn(() => {
          throw exception;
        }),
      };

      jest.spyOn(AuthorizationBuilderService, 'create').mockReturnValue(authorizationBuilderServiceMock as AuthorizationBuilderService);

      handler(EVENT as APIGatewayRequestAuthorizerEvent, CONTEXT, callback);

      expect(callback).toHaveBeenCalledWith('Unauthorized', null);
    });

    it('throws an Error when XApiKeyPolicyBuilder return an invalid policy and retun callback with it', () => {
      const authorizerResponseInvalid = LambdaAuthorizerResponseFactory.createInvalid();

      xApiKeyPolicyBuilderMock = {
        build: jest.fn(() => authorizerResponseInvalid),
      };
      jest.spyOn(XApiKeyPolicyBuilder, 'create').mockReturnValue(xApiKeyPolicyBuilderMock as XApiKeyPolicyBuilder);

      handler(EVENT as APIGatewayRequestAuthorizerEvent, CONTEXT, callback);

      expect(callback).toHaveBeenCalledWith('Unauthorized', null);
      expect(AuthorizationBuilderService.create).not.toHaveBeenCalled();
    });
  });

  function tearUp(): void {
    createMocks();
  }

  function createMocks(): void {
    callback = jest.fn();
  }

  function tearDown() {
    jest.clearAllMocks();
  }
});
