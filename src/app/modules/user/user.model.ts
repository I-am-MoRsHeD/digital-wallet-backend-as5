import { model, Schema } from "mongoose";
import { IUser, Role } from "./user.interface";
import { Active, isApproved } from "../../interface/globalTypes";
import { IWallet } from "../wallet/wallet.interface";
import { Wallet } from "../wallet/wallet.model";


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(Active),
        default: Active.ACTIVE
    },
    isApproved: {
        type: String,
        enum: Object.values(isApproved),
        default: isApproved.PENDING
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
    }
}, {
    versionKey: false,
    timestamps: true
});

userSchema.pre('save', async function (next) {

    if (this.isNew && this.role !== Role.ADMIN) {
        const payload: IWallet = {
            walletName: 'Main Wallet',
            balance: 50,
            phoneNumber: this.phoneNumber,
            user: this._id,
            status: Active.ACTIVE
        };
        const wallet = await Wallet.create(payload);

        this.wallet = wallet._id;
    };

    next();
});

userSchema.post('findOneAndUpdate', async function (doc) {
    if (!doc) return "No updated document found";

    const walletId = doc.wallet;
    if (!walletId) return "No user wallet found"

    if (doc.phoneNumber) {
        const payload: Partial<IWallet> = {
            phoneNumber: doc.phoneNumber
        };

        await Wallet.findByIdAndUpdate(walletId, payload, { new: true, runValidators: true });
    }
})

export const User = model<IUser>('User', userSchema);