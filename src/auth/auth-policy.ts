export class AuthPolicy {
  static HttpVerb = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    HEAD: 'HEAD',
    DELETE: 'DELETE',
    OPTIONS: 'OPTIONS',
    ALL: '*',
  };

  allowMethods: any[] = [];
  awsAccountId: string;
  denyMethods: any[] = [];
  pathRegex: RegExp;
  principalId: string;
  region: string;
  restApiId: string;
  stage: string;
  version: string;

  constructor(principal: string, awsAccountId: string, apiOptions: any) {
    this.awsAccountId = awsAccountId;
    this.principalId = principal;
    this.version = '2012-10-17';
    this.pathRegex = new RegExp('^[/.a-zA-Z0-9-*]+$');
    this.allowMethods = [];
    this.denyMethods = [];

    if (!apiOptions || !apiOptions.restApiId) {
      this.restApiId = '*';
    } else {
      this.restApiId = apiOptions.restApiId;
    }

    if (!apiOptions || !apiOptions.region) {
      this.region = '*';
    } else {
      this.region = apiOptions.region;
    }

    if (!apiOptions || !apiOptions.stage) {
      this.stage = '*';
    } else {
      this.stage = apiOptions.stage;
    }
  }

  allowAllMethods() {
    this.addMethod('allow', '*', '*', null);
  }

  denyAllMethods() {
    this.addMethod('deny', '*', '*', null);
  }

  allowMethod(verb: string, resource: string) {
    this.addMethod('allow', verb, resource, null);
  }

  denyMethod(verb: string, resource: string) {
    this.addMethod('deny', verb, resource, null);
  }

  allowMethodWithConditions(verb: string, resource: string, conditions: any) {
    this.addMethod('allow', verb, resource, conditions);
  }

  denyMethodWithConditions(verb: string, resource: string, conditions: any) {
    this.addMethod('deny', verb, resource, conditions);
  }

  allowResourceArn(resourceArn: any) {
    this.allowResourcesArn(resourceArn);
  }

  build() {
    if ((!this.allowMethods || this.allowMethods.length === 0) && (!this.denyMethods || this.denyMethods.length === 0)) {
      throw new Error('No statements defined for the policy');
    }

    const policy: any = {};
    policy.principalId = this.principalId;
    const doc: any = {};
    doc.Version = this.version;
    doc.Statement = [];

    doc.Statement = doc.Statement.concat(this.getStatementsForEffect('Allow', this.allowMethods));
    doc.Statement = doc.Statement.concat(this.getStatementsForEffect('Deny', this.denyMethods));

    policy.policyDocument = doc;

    return policy;
  }

  private addMethod(effect: string, verb: string, resource: string, _conditions: any) {
    // eslint-disable-next-line no-prototype-builtins
    if (verb !== '*' && !AuthPolicy.HttpVerb.hasOwnProperty(verb)) {
      throw new Error(`Invalid HTTP verb ${verb}. Allowed verbs in AuthPolicy.HttpVerb`);
    }

    if (!this.pathRegex.test(resource)) {
      throw new Error(`Invalid resource path: ${resource}. Path should match ${this.pathRegex}`);
    }

    let cleanedResource = resource;

    if (resource.substring(0, 1) === '/') {
      cleanedResource = resource.substring(1, resource.length);
    }

    const _resourceArn =
      'arn:aws:execute-api:' +
      this.region +
      ':' +
      this.awsAccountId +
      ':' +
      this.restApiId +
      '/' +
      this.stage +
      '/' +
      verb +
      '/' +
      cleanedResource;

    if (effect.toLowerCase() === 'allow') {
      this.allowMethods.push({
        resourceArn: _resourceArn,
        conditions: _conditions,
      });
    } else if (effect.toLowerCase() === 'deny') {
      this.denyMethods.push({
        resourceArn: _resourceArn,
        conditions: _conditions,
      });
    }
  }

  private allowResourcesArn(_resourceArn: string): void {
    this.allowMethods.push({
      resourceArn: _resourceArn,
      conditions: null,
    });
  }

  private getEmptyStatement(effect: string): any {
    effect = effect.substring(0, 1).toUpperCase() + effect.substring(1, effect.length).toLowerCase();

    return {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: [],
    };
  }

  private getStatementsForEffect(effect: string, methods: any[]): any[] {
    const statements = [];

    if (methods.length > 0) {
      const statement = this.getEmptyStatement(effect);

      for (const method of methods) {
        const curMethod = method;

        if (curMethod.conditions === null || curMethod.conditions.length === 0) {
          statement.Resource.push(curMethod.resourceArn);
        } else {
          const conditionalStatement = this.getEmptyStatement(effect);
          conditionalStatement.Resource.push(curMethod.resourceArn);
          conditionalStatement.Condition = curMethod.conditions;
          statements.push(conditionalStatement);
        }
      }

      if (statement.Resource !== null && statement.Resource.length > 0) {
        statements.push(statement);
      }
    }

    return statements;
  }
}
