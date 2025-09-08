import { Types } from "mongoose";
import { Active } from "../../interface/globalTypes";

export interface IWallet {
    _id?: string;
    walletName: string;
    phoneNumber?: string;
    balance: number;
    status: Active;
    user: Types.ObjectId;
}