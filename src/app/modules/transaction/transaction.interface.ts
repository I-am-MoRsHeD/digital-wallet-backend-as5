import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export enum TType {
    WITHDRAWAL = 'WITHDRAWAL',
    SEND_MONEY = 'SEND_MONEY',
    CASH_IN = 'CASH_IN',
}

export interface ITransaction {
    _id?: Types.ObjectId,
    amount: number,
    type: TType,
    status: 'COMPLETED',
    sender?: Types.ObjectId | IUser,
    receiver?: Types.ObjectId | IUser,
};