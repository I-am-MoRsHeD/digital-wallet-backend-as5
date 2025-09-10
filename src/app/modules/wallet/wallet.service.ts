import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import { IWallet } from "./wallet.interface";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { Active, isApproved } from "../../interface/globalTypes";
import { depositCommonFunc } from "./wallet.constant";
import { TType } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";

const getAllWallets = async () => {
    const wallets = await Wallet.find({});

    return wallets;
};
// const blockUserWallet = async (id: string, payload: Partial<IWallet>) => {
//     const { status } = payload;
//     const wallet = await Wallet.findById(id);

//     if (!wallet) {
//         throw new AppError(404, 'Wallet not found');
//     };
//     const user = await User.findById(wallet.user);
//     if (!user) {
//         throw new AppError(404, 'User not found');
//     };
//     if (user.role !== Role.USER) {
//         throw new AppError(400, 'Only regular users can be blocked');
//     };

//     wallet.status = status as Active;
//     await wallet.save();

//     return wallet;
// };
const getMe = async (userId: string) => {
    const wallet = await Wallet.findOne({ user: userId }).populate('user', '-password');
    return wallet;
};

const withdrawWallet = async (payload: Partial<IWallet>, decodedUser: JwtPayload) => {
    const { balance: amount, phoneNumber: agentPhoneNumber } = payload;

    const user = await User.findById(decodedUser.userId);
    const agentWallet = await Wallet.findOne({ phoneNumber: agentPhoneNumber });
    const agent = await User.findById(agentWallet?.user);
    const userWallet = await Wallet.findOne({ user: decodedUser.userId });

    if (!user) {
        throw new AppError(404, 'User not found');
    };
    if(user.isActive === Active.BLOCKED){
        throw new AppError(400, 'User is blocked');
    };
    if(agent?.isApproved === isApproved.SUSPENDED){
        throw new AppError(400, 'Agent is suspended');
    };

    if (!userWallet) {
        throw new AppError(404, 'Wallet not found');
    };
    if (userWallet.status === Active.BLOCKED) {
        throw new AppError(400, 'Wallet is blocked');
    };
    if (Number(amount) < 0) {
        throw new AppError(400, 'Balance cannot be negative');
    } else if (Number(amount) > userWallet.balance) {
        throw new AppError(400, 'Insufficient balance');
    };

    if (agentWallet && agentWallet.user.toString() === decodedUser.userId) {
        throw new AppError(400, "You cannot withdraw to your own wallet");
    };

    if (agent && agent.role !== Role.AGENT) {
        throw new AppError(400, "Withdrawals can only be made to agent accounts");
    };

    if (!agentWallet) {
        throw new AppError(404, "Agent's Wallet not found");
    };
    if (agentWallet.status === Active.BLOCKED) {
        throw new AppError(400, "Agent's Wallet is blocked");
    };

    const newBalance = userWallet.balance - Number(amount);
    userWallet.balance = newBalance;

    const newAgentWalletBalance = agentWallet.balance + Number(amount);
    agentWallet.balance = newAgentWalletBalance

    await userWallet.save();
    await agentWallet.save();

    const transactionPayload = {
        type: TType.WITHDRAWAL,
        amount: amount,
        sender: userWallet._id,
        receiver: agentWallet._id
    };
    await Transaction.create(transactionPayload);

    return {
        userWallet,
        agentWallet
    };
};

const sendMoneyToWallet = async (payload: Partial<IWallet>, decodedUser: JwtPayload) => {
    const wallet = await depositCommonFunc(payload, decodedUser, TType.SEND_MONEY);

    return wallet;
}
const cashInToUserWallet = async (payload: Partial<IWallet>, decodedUser: JwtPayload) => {
    const wallet = await depositCommonFunc(payload, decodedUser, TType.CASH_IN);

    return wallet;
}

export const WalletServices = {
    getAllWallets,
    getMe,
    withdrawWallet,
    sendMoneyToWallet,
    cashInToUserWallet,
}