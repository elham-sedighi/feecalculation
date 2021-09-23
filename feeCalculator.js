import {Observable} from "rxjs";
import {OperationType} from "./model/operationType";
import {Operation} from "./model/operation";
import {UserType} from "./model/userType";
import * as moment from 'moment'
import {feeConfigs} from "./model/feeConfig";

export class FeeCalculator {

    userOperationRecords: Map<number, { date: moment.Moment, amount: number }> =
        new Map<number, { date: moment.Moment, amount: number }>();
feeConfigs: feeConfigs = {cash_in: null, cash_out_natural: null, cash_out_juridical: null};

getCashInFeeConfig(): Observable<any> {
    return this.http.get('https://private-00d723-paysera.apiary-proxy.com/cash-in')
}

getCashOutFeeConfigNatural(): Observable<any> {
    return this.http.get('https://private-00d723-paysera.apiary-proxy.com/cash-out-natural')
}

getCashOutFeeConfigJuridical(): Observable<any> {
    return this.http.get('https://private-00d723-paysera.apiary-proxy.com/cash-out-juridical')
}

formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

calculateFee(opr: Operation): number {
    if (opr.type === OperationType.cash_in) {
        return this.calculateCashInFee(opr.operation.amount);
    }
    return this.calculateCashOutFee(opr);
}

calculateCashInFee(amount: number) {
    let fee = parseFloat(this.formatter.format((amount * this.feeConfigs.cash_in.percents) / 100));
    fee = fee > this.feeConfigs.cash_in.max.amount ? this.feeConfigs.cash_in.max.amount : fee;
    return fee;
}

calculateCashOutFee(opr: Operation) {
    if (opr.user_type === UserType.juridical) {
        return this.calculateCashOutJuridicalFee(opr);
    }
    return this.calculateCashOutNatural(opr);
}

calculateCashOutJuridicalFee(opr: Operation) {
    let fee = parseFloat(this.formatter.format((opr.operation.amount * this.feeConfigs.cash_out_juridical.percents) / 100));
    fee = fee < this.feeConfigs.cash_out_juridical.min.amount ? this.feeConfigs.cash_in.min.amount : fee;
    return fee;
}

calculateCashOutNatural(opr: Operation) {
    const existedAmount = this.getExistedAmount(opr.user_id, moment(opr.date, 'YYYY-MM-DD'));
    let fee = this.calculateCashOutNaturalFee(existedAmount, opr.operation.amount);
    this.addOprToMap(opr);
    return fee;
}

getExistedAmount(userId: number, date: moment.Moment) {
    let oldRecord = this.userOperationRecords.get(userId);
    if (!oldRecord) {
        return 0;
    }
    if (oldRecord.date.week() === date.week()) {
        return oldRecord.amount;
    }
    return 0;
}

calculateCashOutNaturalFee(existedAmount: number, newAmount: number) {
    let fee = 0;
    const allAmounts = existedAmount + newAmount;
    if (allAmounts > this.feeConfigs.cash_out_natural.week_limit.amount) {
        const effectiveAmount = newAmount - this.calculateExceededAmount(existedAmount);
        fee = parseFloat(this.formatter.format(effectiveAmount *
            this.feeConfigs.cash_out_natural.percents * 0.01));
    }
    return fee;
}

calculateExceededAmount(existedAmount: number): number {
    if (existedAmount - this.feeConfigs.cash_out_natural.week_limit.amount > 0) {
        return 0;
    }
    return this.feeConfigs.cash_out_natural.week_limit.amount - existedAmount;
}

addOprToMap(opr: Operation) {
    let oldRecord = this.userOperationRecords.get(opr.user_id);
    const opr_Date = moment(opr.date, 'YYYY-MM-DD');
    if (!oldRecord) {
        this.userOperationRecords.set(opr.user_id, {date: opr_Date, amount: opr.operation.amount});
    } else {
        if (oldRecord.date.week() === opr_Date.week()) {
            oldRecord.amount = oldRecord.amount + opr.operation.amount;
        } else {
            this.userOperationRecords.set(opr.user_id, {date: opr_Date, amount: opr.operation.amount});
        }
    }
}
}