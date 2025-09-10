import { JwtPayload } from "jsonwebtoken";
import { IWallet } from "./wallet.interface";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "./wallet.model";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { Active, isApproved } from "../../interface/globalTypes";
import { TType } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";


export const depositCommonFunc = async (payload: Partial<IWallet>, decodedUser: JwtPayload, method: TType) => {
    const { balance: sendingAmount, phoneNumber: recipientPhoneNumber } = payload;

    if (!sendingAmount || Number(sendingAmount) <= 0) {
        throw new AppError(400, 'Amount must be greater than zero');
    };

    const user = await User.findById(decodedUser.userId);

    const [senderWallet, recipientUser, recipientWallet] = await Promise.all([
        Wallet.findOne({ user: decodedUser.userId }),
        User.findOne({ phoneNumber: recipientPhoneNumber }),
        Wallet.findOne({ phoneNumber: recipientPhoneNumber }),
    ]);


    if (!user) {
        throw new AppError(404, 'User not found');
    };
    if (user.role === Role.USER) {
        if (user?.isActive === Active.BLOCKED) {
            throw new AppError(400, 'User is blocked');
        };
    };
    if (user.role === Role.AGENT) {
        if (user?.isApproved === isApproved.SUSPENDED) {
            throw new AppError(400, 'Agent is suspended');
        };
    };

    if (!recipientUser) {
        throw new AppError(404, 'Recipient user not found');
    };
    if (recipientUser.isActive === Active.BLOCKED) {
        throw new AppError(400, 'Recipient user is blocked');
    };

    if (recipientUser._id.toString() === decodedUser.userId) {
        throw new AppError(400, 'You cannot send money to yourself');
    }

    if (recipientUser.role !== Role.USER) {
        throw new AppError(400, 'Money can only be sent to regular user accounts');
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
        sender: decodedUser.userId,
        receiver: recipientUser._id,
    };
    await Transaction.create(transactionPayload);

    return {
        senderWallet,
        recipientWallet
    }
};