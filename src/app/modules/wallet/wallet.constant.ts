import { JwtPayload } from "jsonwebtoken";
import { IWallet } from "./wallet.interface";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "./wallet.model";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { Active } from "../../interface/globalTypes";
import { TType } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";


export const depositCommonFunc = async (payload: Partial<IWallet>, decodedUser: JwtPayload, method: TType) => {
    const { balance: sendingAmount, user: recipientUserId } = payload;

    if (!sendingAmount || Number(sendingAmount) <= 0) {
        throw new AppError(400, 'Amount must be greater than zero');
    }

    const [senderWallet, recipientUser] = await Promise.all([
        Wallet.findOne({ user: decodedUser.userId }),
        User.findById(recipientUserId),
    ]);

    if (!recipientUser) {
        throw new AppError(404, 'Recipient user not found');
    }

    if (recipientUser.role !== Role.USER) {
        throw new AppError(400, 'Money can only be sent to regular user accounts');
    }

    if (recipientUser.isActive === Active.BLOCKED) {
        throw new AppError(400, 'Recipient user is blocked');
    }

    if (!senderWallet) {
        throw new AppError(404, 'Sender wallet not found');
    }
    if (senderWallet.status === Active.BLOCKED) {
        throw new AppError(400, 'Sender wallet is blocked');
    };
    if (Number(sendingAmount) > senderWallet.balance) {
        throw new AppError(400, 'Insufficient balance');
    }

    const recipientWallet = await Wallet.findOne({ user: recipientUserId });
    if (!recipientWallet) {
        throw new AppError(404, 'Recipient wallet not found');
    };
    if (recipientWallet.status === Active.BLOCKED) {
        throw new AppError(400, 'Recipient wallet is blocked');
    };

    senderWallet.balance -= Number(sendingAmount);
    recipientWallet.balance += Number(sendingAmount);
    await senderWallet.save();
    await recipientWallet.save();

    const transactionPayload = {
        type: method,
        amount: sendingAmount,
        totalBalance: senderWallet.balance,
        sender: decodedUser.userId,
        receiver: recipientUserId
    };
    await Transaction.create(transactionPayload);

    return {
        senderWallet,
        recipientWallet
    }
};