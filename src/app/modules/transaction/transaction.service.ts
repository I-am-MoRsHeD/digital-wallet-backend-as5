import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "./transaction.model"
import { transactionSearchableFields } from "./transaction.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllTransactions = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Transaction.find()
        .populate('sender')
        .populate('receiver'), query);

    const transactions = await queryBuilder
        .filter()
        .search(transactionSearchableFields)
        .sort()
        .paginate()

    const [data, meta] = await Promise.all([
        transactions.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};


const getTransactionsForDecodedUser = async (query: Record<string, string>, decodedUser: JwtPayload) => {
    const userId = decodedUser.userId;

    const searchQuery = {
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    };

    const baseQuery = Transaction.find(searchQuery)
        .populate('sender')
        .populate('receiver');

    const queryBuilder = new QueryBuilder(baseQuery, query);
    const transactions = await queryBuilder
        .filter()
        .search(transactionSearchableFields)
        .sort()
        .paginate()

    const [data, meta] = await Promise.all([
        transactions.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};

export const TransactionServices = {
    getAllTransactions,
    getTransactionsForDecodedUser
};