import { AuthPolicy } from '../../auth/auth-policy';

export default class PolicyResponseFactory {
  static createAllowed(principalId: string, awsAccountId: string, methodArn: string): PolicyResponseFactory {
    const apiOptions = {};

    const policy = new AuthPolicy(principalId, awsAccountId, apiOptions);
    policy.allowAllMethods();
    policy.allowResourceArn(methodArn);

    return policy.build();
  }

  static createDenied(principalId: string, awsAccountId: string): PolicyResponseFactory {
    const apiOptions = {};

    const policy = new AuthPolicy(principalId, awsAccountId, apiOptions);
    policy.denyAllMethods();

    return policy.build();
  }
}
