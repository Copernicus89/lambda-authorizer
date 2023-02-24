import LambdaAuthorizerResponse from '../../model/lambda-authorizer-response';
import StatementItemFactory from './statement-item-factory';

export default class LambdaAuthorizerResponseFactory {
  static readonly PRINCIPAL_ID = 'principalId';
  static readonly VERSION = 'version';

  static readonly ERROR_MESSAGE = 'errorMessage';
  static readonly API_KEY = 'API_KEY';

  static createValid(): LambdaAuthorizerResponse {
    return {
      usageIdentifierKey: this.API_KEY,
      principalId: this.PRINCIPAL_ID,
      policyDocument: {
        Version: this.VERSION,
        Statement: [StatementItemFactory.create()],
      },
    };
  }

  static createInvalid(): LambdaAuthorizerResponse {
    return {
      usageIdentifierKey: this.API_KEY,
      errorMessage: this.ERROR_MESSAGE,
    };
  }
}
