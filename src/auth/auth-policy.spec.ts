import { AuthPolicy } from './auth-policy';

describe('AuthPolicy', () => {
  let authPolicy: AuthPolicy;
  let apiOptions: any;

  beforeEach(() => tearUp());

  describe('method build should return a policy object', () => {
    it('allowing all methods', async () => {
      authPolicy.allowAllMethods();

      const expecteResult = {
        principalId: 'principal',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: ['arn:aws:execute-api:*:awsAccountId:*/*/*/*'],
            },
          ],
        },
      };

      const result = authPolicy.build();

      expect(result).toEqual(expecteResult);
    });

    it('denying all methods', async () => {
      authPolicy.denyAllMethods();

      const expecteResult = {
        principalId: 'principal',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Deny',
              Resource: ['arn:aws:execute-api:*:awsAccountId:*/*/*/*'],
            },
          ],
        },
      };

      const result = authPolicy.build();

      expect(result).toEqual(expecteResult);
    });

    it('allowing a single method', async () => {
      authPolicy.allowMethod(AuthPolicy.HttpVerb.GET, '*');

      const expecteResult = {
        principalId: 'principal',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: ['arn:aws:execute-api:*:awsAccountId:*/*/GET/*'],
            },
          ],
        },
      };

      const result = authPolicy.build();

      expect(result).toEqual(expecteResult);
    });

    it('denying a single method', async () => {
      authPolicy.denyMethod(AuthPolicy.HttpVerb.GET, '*');

      const expecteResult = {
        principalId: 'principal',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Deny',
              Resource: ['arn:aws:execute-api:*:awsAccountId:*/*/GET/*'],
            },
          ],
        },
      };

      const result = authPolicy.build();

      expect(result).toEqual(expecteResult);
    });

    it('allowing with conditions', async () => {
      const conditions = {
        Origin: 'http://siteA.com',
      };

      authPolicy.allowMethodWithConditions(AuthPolicy.HttpVerb.GET, '*', conditions);

      const expecteResult = {
        principalId: 'principal',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Condition: {
                Origin: 'http://siteA.com',
              },
              Effect: 'Allow',
              Resource: ['arn:aws:execute-api:*:awsAccountId:*/*/GET/*'],
            },
          ],
        },
      };

      const result = authPolicy.build();

      expect(result).toEqual(expecteResult);
    });

    it('denying with conditions', async () => {
      const conditions = {
        Origin: 'http://siteA.com',
      };
      authPolicy.denyMethodWithConditions(AuthPolicy.HttpVerb.GET, '*', conditions);

      const expecteResult = {
        principalId: 'principal',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Condition: {
                Origin: 'http://siteA.com',
              },
              Effect: 'Deny',
              Resource: ['arn:aws:execute-api:*:awsAccountId:*/*/GET/*'],
            },
          ],
        },
      };

      const result = authPolicy.build();

      expect(result).toEqual(expecteResult);
    });

    it('allowing resource arn', async () => {
      const RESOURCE_ARN = 'RESOURCE_ARN';
      authPolicy.allowResourceArn(RESOURCE_ARN);

      const expecteResult = {
        principalId: 'principal',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: [RESOURCE_ARN],
            },
          ],
        },
      };

      const result = authPolicy.build();

      expect(result).toEqual(expecteResult);
    });

    it('should clean resources path', async () => {
      const RESOURCE = 'path/to/RESOURCE';
      const PATH_TO_RESOURCE = `/${RESOURCE}`;

      authPolicy.allowMethodWithConditions(AuthPolicy.HttpVerb.GET, PATH_TO_RESOURCE, {});

      const expecteResult = {
        principalId: 'principal',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Condition: {},
              Effect: 'Allow',
              Resource: [`arn:aws:execute-api:*:awsAccountId:*/*/GET/${RESOURCE}`],
            },
          ],
        },
      };

      const result = authPolicy.build();

      expect(result).toEqual(expecteResult);
    });
  });

  describe('auth policy properties', () => {
    it('rest api property should be properly set', async () => {
      const REST_API_ID = 'REST_API_ID';

      apiOptions = {
        restApiId: REST_API_ID,
      };

      authPolicy = new AuthPolicy('principal', 'awsAccountId', apiOptions);

      expect(authPolicy.restApiId).toEqual(REST_API_ID);
    });

    it('region property should be properly set', async () => {
      const REGION = 'REGION';

      apiOptions = {
        region: REGION,
      };

      authPolicy = new AuthPolicy('principal', 'awsAccountId', apiOptions);

      expect(authPolicy.region).toEqual(REGION);
    });

    it('stage property should be properly set', async () => {
      const STAGE = 'STAGE';

      apiOptions = {
        stage: STAGE,
      };

      authPolicy = new AuthPolicy('principal', 'awsAccountId', apiOptions);

      expect(authPolicy.stage).toEqual(STAGE);
    });
  });

  describe('should throw error', () => {
    it('if not allow nor deny method defined', async () => {
      expect(() => {
        authPolicy.build();
      }).toThrow('No statements defined for the policy');
    });

    it('if not a valid method', async () => {
      const METHOD = 'NOT_A_METHOD';
      expect(() => {
        authPolicy.allowMethod(METHOD, '*');
      }).toThrow(`Invalid HTTP verb ${METHOD}. Allowed verbs in AuthPolicy.HttpVerb`);
    });

    it('if not a valid resource path', async () => {
      const RESOURCE = 'ç';
      expect(() => {
        authPolicy.allowMethodWithConditions(AuthPolicy.HttpVerb.GET, RESOURCE, {});
      }).toThrow(`Invalid resource path: ${RESOURCE}. Path should match /^[/.a-zA-Z0-9-*]+$/`);
    });
  });

  function tearUp() {
    authPolicy = new AuthPolicy('principal', 'awsAccountId', null);
  }
});
