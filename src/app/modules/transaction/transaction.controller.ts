/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionServices } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITransaction } from "./transaction.interface";
import { JwtPayload } from "jsonwebtoken";


const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await TransactionServices.getAllTransactions(query as Record<string, string>);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All transactions retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getTransactionsForDecodedUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const verifiedUser = req.user;
    const result = await TransactionServices.getTransactionsForDecodedUser(query as Record<string, string>, verifiedUser as JwtPayload);

    sendResponse<ITransaction[]>(res, {
        statusCode: 200,
        success: true,
        message: "Transactions retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getCashInTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const verifiedUser = req.user;
    const result = await TransactionServices.getCashInTransactions(query as Record<string, string>, verifiedUser as JwtPayload);

    sendResponse<ITransaction[]>(res, {
        statusCode: 200,
        success: true,
        message: "Cash In transactions retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getWithdrawTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const verifiedUser = req.user;
    const result = await TransactionServices.getWithdrawTransactions(query as Record<string, string>, verifiedUser as JwtPayload);

    sendResponse<ITransaction[]>(res, {
        statusCode: 200,
        success: true,
        message: "Cash out transactions retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

export const TransactionController = {
    getAllTransactions,
    getTransactionsForDecodedUser,
    getCashInTransactions,
    getWithdrawTransactions,
};