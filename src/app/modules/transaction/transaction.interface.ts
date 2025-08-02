import { IUser } from "../user/user.interface";

export enum TType {
    TOPUP = 'TOPUP',
    WITHDRAWAL = 'WITHDRAWAL',
    SEND_MONEY = 'SEND_MONEY',
    CASH_IN = 'CASH_IN',
    CASH_OUT = 'CASH_OUT',
}

export interface ITransaction {
    _id?: string,
    amount: number,
    totalBalance: number,
    type: TType,
    status: 'COMPLETED',
    sender?: Partial<IUser>,
    receiver?: Partial<IUser>,
};