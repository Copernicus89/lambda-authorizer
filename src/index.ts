import { APIGatewayRequestAuthorizerEvent, Callback, Context } from 'aws-lambda';
import AuthorizationBuilderService from './service/authorization-builder-service';
import { XApiKeyPolicyBuilder } from './service/x-api-key-policy-builder';

export const handler = (event: APIGatewayRequestAuthorizerEvent, context: Context, callback: Callback) => {
  const unauthorized = 'Unauthorized';

  try {
    let authorizerResponse = XApiKeyPolicyBuilder.create(event).build();

    if (!authorizerResponse.policyDocument) {
      throw new Error(authorizerResponse.errorMessage);
    }

    authorizerResponse = AuthorizationBuilderService.create(event, authorizerResponse).build();

    callback(null, authorizerResponse);
  } catch (e) {
    console.log(`[${e.name}]: ${e.message}`);
    callback(unauthorized, null);
  }
};
