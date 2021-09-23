import {OperationDetail} from "./operationDetail";

export class FeeConfig {
    constructor(percents) {
        this.percents = percents;
    }
}

export class cash_InFeeConfig extends FeeConfig {
    constructor(percents, max) {
        super(percents);
        this.max = new OperationDetail(max.amount, max.currency);
    }
}

export class cash_OutJuridicalFeeConfig extends FeeConfig {
    constructor(percents, min) {
        super(percents);
        this.min = new OperationDetail(min.amount, min.currency);
    }
}

export class cash_OutNaturalFeeConfig extends FeeConfig {
    constructor(percents, week_limit) {
        super(percents);
        this.week_limit = new OperationDetail(week_limit.amount, week_limit.currency);
    }
}
