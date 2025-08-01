import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import { IWallet } from "./wallet.interface";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { Active } from "../../interface/globalTypes";
import { depositCommonFunc } from "./wallet.constant";

const getAllWallets = async () => {
    const wallets = await Wallet.find({});

    return wallets;
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
    const newBalance = wallet.balance + Number(balance);
    wallet.balance = newBalance;

    await wallet.save();
    return wallet;
};

const withdrawWallet = async (balance: number, decodedUser: JwtPayload) => {
    const wallet = await Wallet.findOne({ user: decodedUser.userId });
    if (!wallet) {
        throw new AppError(404, 'Wallet not found');
    };

    if (balance < 0) {
        throw new AppError(400, 'Balance cannot be negative');
    } else if (balance > wallet.balance) {
        throw new AppError(400, 'Insufficient balance');
    }

    const newBalance = wallet.balance - Number(balance);
    wallet.balance = newBalance;

    await wallet.save();
    return wallet;
};

const getAgentWallet = async (decodedUser: JwtPayload) => {
    const wallet = await Wallet.findOne({ user: decodedUser.userId });
    if (!wallet) {
        throw new AppError(404, 'Wallet not found');
    };

    return wallet;
};
const sendMoneyToWallet = async (payload: Partial<IWallet>, decodedUser: JwtPayload) => {
    const wallet = await depositCommonFunc(payload, decodedUser);

    return wallet;
}
const cashInToUserWallet = async (payload: Partial<IWallet>, decodedUser: JwtPayload) => {
    const wallet = await depositCommonFunc(payload, decodedUser);

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

    if (Number(sendingAmount) > agentWallet.balance) {
        throw new AppError(400, 'Insufficient balance');
    }

    const recipientWallet = await Wallet.findOne({ user: recipientUserId });
    if (!recipientWallet) {
        throw new AppError(404, 'Recipient wallet not found');
    }

    recipientWallet.balance -= Number(sendingAmount);
    agentWallet.balance += Number(sendingAmount);

    await agentWallet.save();
    await recipientWallet.save();
    return {
        agentWallet,
        recipientWallet
    }
}
export const WalletServices = {
    getAllWallets,
    getUserWallet,
    topUpWallet,
    withdrawWallet,
    getAgentWallet,
    sendMoneyToWallet,
    cashInToUserWallet,
    cashOutFromUserWallet
}