import { Types } from "mongoose";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";


const getAgentTransactionOverview = async (decodedUser: JwtPayload) => {
    const userId = decodedUser.userId;

    if (!decodedUser) {
        throw new Error('Invalid token');
    };
    if (decodedUser.role !== 'AGENT') {
        throw new Error('Only agents can access this data');
    };


    const totalCashInAmount = await Transaction.aggregate([
        { $match: { sender: new Types.ObjectId(String(userId)), type: "CASH_IN" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);


    const totalWithdrawAmount = await Transaction.aggregate([
        { $match: { receiver: new Types.ObjectId(String(userId)), type: 'WITHDRAWAL' } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);

    const tatalBalance = await Wallet.findOne({ user: userId });

    return {
        totalCashInAmount: totalCashInAmount[0]?.totalAmount || 0,
        totalWithdrawAmount: totalWithdrawAmount[0]?.totalAmount || 0,
        balance: tatalBalance?.balance || 0
    };
};

const getAdminStats = async (decodedUser: JwtPayload) => {
    if (!decodedUser) {
        throw new Error('Invalid token');
    };
    if (decodedUser.role !== 'ADMIN') {
        throw new Error('Only agents can access this data');
    };

    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalAgents = await User.countDocuments({ role: 'AGENT' });
    const transactionCount = await Transaction.countDocuments();
    const totalTransactionAmountAgg = await Transaction.aggregate([
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    const totalTransactionAmount = totalTransactionAmountAgg[0]?.totalAmount || 0;

    return {
        totalUsers,
        totalAgents,
        transactionCount,
        totalTransactionAmount
    }
};

export const StatsServices = {
    getAgentTransactionOverview,
    getAdminStats
};