import { Types } from "mongoose";
import { Active, isApproved } from "../../interface/globalTypes";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
};

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    isDeleted?: boolean;
    isActive?: Active;
    isApproved?: isApproved;
    role: Role;
    wallet?: string;
};