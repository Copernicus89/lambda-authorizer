import PolicyResponse from './policy-response';

export default interface LambdaAuthorizerResponse extends PolicyResponse {
  usageIdentifierKey: string;
  errorMessage?: string;
  context?: {
    authHeader: string;
  };
}
