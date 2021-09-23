import {OperationDetail} from "./operationDetail";
import * as moment from 'moment';

export class Operation {
    constructor(user_id, date, user_type, type, operation) {
        this.user_id = user_id;
        this.date = moment(date, 'YYYY-MM-DD');
        this.user_type = user_type;
        this.type = type;
        this.operation = new OperationDetail(operation.amount, operation.currency)
    }
}
