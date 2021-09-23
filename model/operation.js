import * as moment from 'moment';
// import OperationDetail from './operationDetail';

class Operation {
  constructor(userId, date, userType, type) {
    this.user_id = userId;
    this.date = moment(date, 'YYYY-MM-DD');
    this.user_type = userType;
    this.type = type;
    // this.operation = new OperationDetail(operation.amount, operation.currency);
  }
}

module.exports.default = Operation;
