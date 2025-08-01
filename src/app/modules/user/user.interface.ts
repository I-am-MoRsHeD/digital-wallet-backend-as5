import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
};

export enum Active {
    ACTIVE = "ACTIVE",
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED'
};

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    isDeleted?: boolean;
    isActive?: Active;
    role: Role;
    wallet?: Types.ObjectId[];
};