import StatementItem from './statement-item';

export default interface PolicyResponse {
  principalId?: string;
  policyDocument?: {
    Version: string;
    Statement: StatementItem[];
  };
}
