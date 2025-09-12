import { Types } from "mongoose";
import { Active, isApproved } from "../../interface/globalTypes";
import { IWallet } from "../wallet/wallet.interface";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
};

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    isDeleted?: boolean;
    isActive?: Active;
    isApproved?: isApproved;
    role: Role;
    wallet?: Types.ObjectId | IWallet;
};

export interface IPassword {
    currentPassword: string;
    newPassword: string;
};