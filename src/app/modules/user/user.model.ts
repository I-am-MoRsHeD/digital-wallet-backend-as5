import { model, Schema } from "mongoose";
import { Active, IUser, Role } from "./user.interface";


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(Active),
        default: Active.ACTIVE
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
}, {
    versionKey: false,
    timestamps: true
});

export const User = model<IUser>('User', userSchema);