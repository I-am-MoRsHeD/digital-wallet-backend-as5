import { Types } from "mongoose";
import { Active } from "../../interface/globalTypes";

export interface IWallet {
    _id?: Types.ObjectId;
    walletName: string;
    phoneNumber?: string;
    balance: number;
    status: Active;
    user: Types.ObjectId;
}