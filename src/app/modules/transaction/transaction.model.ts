import { model, Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";


const transactionRoutes = new Schema<ITransaction>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    totalBalance: { type: Number, required: true },
    status: { type: String, default: 'COMPLETED' },
}, {
    versionKey: false,
    timestamps: true
});

export const Transaction = model<ITransaction>('Transaction', transactionRoutes);