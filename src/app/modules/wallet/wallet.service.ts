import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import { IWallet } from "./wallet.interface";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { Active } from "../../interface/globalTypes";
import { depositCommonFunc } from "./wallet.constant";
import { TType } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";

const getAllWallets = async () => {
    const wallets = await Wallet.find({});

    return wallets;
};
const blockUserWallet = async (id: string, payload: Partial<IWallet>) => {
    const { status } = payload;
    const wallet = await Wallet.findById(id);

    if (!wallet) {
        throw new AppError(404, 'Wallet not found');
    };
    const user = await User.findById(wallet.user);
    if (!user) {
        throw new AppError(404, 'User not found');
    };
    if (user.role !== Role.USER) {
        throw new AppError(400, 'Only regular users can be blocked');
    };

    wallet.status = status as Active;
    await wallet.save();

    return wallet;
};
const getUserWallet = async (decodedUser: JwtPayload) => {
    const wallet = await Wallet.findOne({ user: decodedUser.userId });
    if (!wallet) {
        throw new AppError(404, 'Wallet not found');
    };

    return wallet;
};
const topUpWallet = async (balance: number, decodedUser: JwtPayload) => {
    if (balance < 0) {
        throw new AppError(400, 'Balance cannot be negative');
    }
    const wallet = await Wallet.findOne({ user: decodedUser.userId });

    if (!wallet) {
        throw new AppError(404, 'Wallet not found');
    };
    if (wallet.status === Active.BLOCKED) {
        throw new AppError(400, 'Wallet is blocked');
    };

    const newBalance = wallet.balance + Number(balance);
    wallet.balance = newBalance;
    await wallet.save();

    const transactionPayload = {
        type: TType.TOPUP,
        amount: balance,
        totalBalance : wallet.balance,
        receiver: decodedUser.userId
    };
    await Transaction.create(transactionPayload);
    return wallet;
};
const withdrawWallet = async (balance: number, decodedUser: JwtPayload) => {
    const wallet = await Wallet.findOne({ user: decodedUser.userId });
    if (!wallet) {
        throw new AppError(404, 'Wallet not found');
    };
    if (wallet.status === Active.BLOCKED) {
        throw new AppError(400, 'Wallet is blocked');
    };
    if (balance < 0) {
        throw new AppError(400, 'Balance cannot be negative');
    } else if (balance > wallet.balance) {
        throw new AppError(400, 'Insufficient balance');
    }

    const newBalance = wallet.balance - Number(balance);
    wallet.balance = newBalance;
    await wallet.save();

    const transactionPayload = {
        type: TType.WITHDRAWAL,
        amount: balance,
        totalBalance : wallet.balance,
        sender: decodedUser.userId
    };
    await Transaction.create(transactionPayload);

    return wallet;
};
const sendMoneyToWallet = async (payload: Partial<IWallet>, decodedUser: JwtPayload) => {
    const wallet = await depositCommonFunc(payload, decodedUser, TType.SEND_MONEY);

    return wallet;
}
const getAgentWallet = async (decodedUser: JwtPayload) => {
    const wallet = await Wallet.findOne({ user: decodedUser.userId });
    if (!wallet) {
        throw new AppError(404, 'Wallet not found');
    };

    return wallet;
};
const cashInToUserWallet = async (payload: Partial<IWallet>, decodedUser: JwtPayload) => {
    const wallet = await depositCommonFunc(payload, decodedUser, TType.CASH_IN);

    return wallet;
}
const cashOutFromUserWallet = async (payload: Partial<IWallet>, decodedUser: JwtPayload) => {
    const { balance: sendingAmount, user: recipientUserId } = payload;

    if (!sendingAmount || Number(sendingAmount) <= 0) {
        throw new AppError(400, 'Amount must be greater than zero');
    }

    const [agentWallet, recipientUser] = await Promise.all([
        Wallet.findOne({ user: decodedUser.userId }),
        User.findById(recipientUserId),
    ]);

    if (!recipientUser) {
        throw new AppError(404, 'Recipient user not found');
    }

    if (recipientUser.role !== Role.USER) {
        throw new AppError(400, 'Money can only be withdrawn from regular user accounts');
    }

    if (recipientUser.isActive === Active.BLOCKED) {
        throw new AppError(400, 'Recipient user is blocked');
    }

    if (!agentWallet) {
        throw new AppError(404, 'Sender wallet not found');
    }
    if (agentWallet.status === Active.BLOCKED) {
        throw new AppError(400, 'Agent wallet is blocked');
    };

    if (Number(sendingAmount) > agentWallet.balance) {
        throw new AppError(400, 'Insufficient balance');
    }

    const recipientWallet = await Wallet.findOne({ user: recipientUserId });
    if (!recipientWallet) {
        throw new AppError(404, 'Recipient wallet not found');
    }

    if (recipientWallet.status === Active.BLOCKED) {
        throw new AppError(400, 'Recipient wallet is blocked');
    };

    recipientWallet.balance -= Number(sendingAmount);
    agentWallet.balance += Number(sendingAmount);
    await agentWallet.save();
    await recipientWallet.save();

    const transactionPayload = {
        type: TType.CASH_OUT,
        amount: sendingAmount,
        totalBalance : agentWallet.balance,
        sender: recipientUserId,
        receiver: decodedUser.userId
    };
    await Transaction.create(transactionPayload);

    return {
        agentWallet,
        recipientWallet
    }
}
export const WalletServices = {
    getAllWallets,
    blockUserWallet,
    getUserWallet,
    topUpWallet,
    withdrawWallet,
    getAgentWallet,
    sendMoneyToWallet,
    cashInToUserWallet,
    cashOutFromUserWallet
}