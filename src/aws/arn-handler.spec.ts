import { ArnHandler } from './arn-handler';

describe('ArnHandler', () => {
  it('should return awsAccountId', async () => {
    const event = {
      methodArn: 'apigateway:aws:lambda:eu-west-1:305928124144:function:authorizer/invocations',
    };
    const result = '305928124144';

    expect(ArnHandler.getAWSAccountId(event)).toEqual(result);
  });
});
