import OperationDetail from './operationDetail';

export default class Operation {
  constructor(userId, date, userType, type, amount, currency) {
    this.user_id = userId;
    this.date = date;
    this.user_type = userType;
    this.type = type;
    this.operation = new OperationDetail(amount, currency);
  }
}
