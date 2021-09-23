export class OperationDetail {
    constructor(amount, currency) {
        this.amount = amount; // operation amount(for example `2.12` or `3`)
        this.currency = currency; // should read from config
    }
}
