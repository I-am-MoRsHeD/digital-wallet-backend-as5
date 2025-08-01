import { Types } from "mongoose";
import { Active } from "../../interface/globalTypes";

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
    role: Role;
    wallet?: string;
};