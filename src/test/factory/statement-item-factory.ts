import StatementItem from '../../model/statement-item';

export default class StatementItemFactory {
  static readonly ACTION = 'action';
  static readonly EFFECT = 'effect';
  static readonly RESOURCE = 'resource';

  static create(): StatementItem {
    return {
      Action: this.ACTION,
      Effect: this.EFFECT,
      Resource: [this.RESOURCE],
    };
  }
}
