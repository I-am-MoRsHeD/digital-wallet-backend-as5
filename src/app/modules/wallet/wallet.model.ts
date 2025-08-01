import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";
import { Active } from "../../interface/globalTypes";


const walletSchema = new Schema<IWallet>({
    walletName: { type: String, required: true },
    balance: { type: Number, required: true },
    status: { type: String, enum: Object.values(Active), default: Active.ACTIVE },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    versionKey: false,
    timestamps: true
});

export const Wallet = model<IWallet>('Wallet', walletSchema);
