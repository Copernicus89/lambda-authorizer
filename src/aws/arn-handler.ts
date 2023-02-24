export class ArnHandler {
  static getAWSAccountId(event: any): string {
    const AWSAccountIdPosition = 4;
    const arnSplit = event.methodArn.split(':');
    const awsAccountId = arnSplit[AWSAccountIdPosition];

    return awsAccountId;
  }
}
