import OperationDetail from './operationDetail';

export default class Operation {
  constructor(userId, weekNumber, userType, type, amount, currency) {
    this.user_id = userId;
    this.weekNumber = weekNumber;
    this.user_type = userType;
    this.type = type;
    this.operation = new OperationDetail(amount, currency);
  }
}
