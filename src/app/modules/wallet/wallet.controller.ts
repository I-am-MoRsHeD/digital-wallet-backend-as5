/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { IWallet } from "./wallet.interface";
import { WalletServices } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const getAllWallets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const wallets = await WalletServices.getAllWallets();

    sendResponse<IWallet[]>(res, {
        statusCode: 200,
        success: true,
        message: "All wallets retrieved successfully",
        data: wallets
    });
});

const blockUserWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const wallet = await WalletServices.blockUserWallet(id, req.body);

    sendResponse<IWallet>(res, {
        statusCode: 200,
        success: true,
        message: "User wallet blocked successfully",
        data: wallet
    });
});

// user's wallet actions
const getUserWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const varifiedToken = req.user;
    const wallet = await WalletServices.getUserWallet(varifiedToken as JwtPayload);

    sendResponse<IWallet>(res, {
        statusCode: 200,
        success: true,
        message: "User wallet retrieved successfully",
        data: wallet
    });
});

const topUpWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const varifiedToken = req.user;
    const { balance } = req.body;
    const wallet = await WalletServices.topUpWallet(balance, varifiedToken as JwtPayload);

    sendResponse<IWallet>(res, {
        statusCode: 200,
        success: true,
        message: "Topup completed successfully",
        data: wallet
    });
});

const withdrawWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const varifiedToken = req.user;
    const { balance } = req.body;
    const wallet = await WalletServices.withdrawWallet(balance, varifiedToken as JwtPayload);

    sendResponse<IWallet>(res, {
        statusCode: 200,
        success: true,
        message: "Withdraw completed successfully",
        data: wallet
    });
});

// agent's wallet actions
const getAgentWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const varifiedToken = req.user;
    const wallet = await WalletServices.getAgentWallet(varifiedToken as JwtPayload);

    sendResponse<IWallet>(res, {
        statusCode: 200,
        success: true,
        message: "Agent wallet retrieved successfully",
        data: wallet
    });
});

const sendMoneyToWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const varifiedToken = req.user;
    const wallet = await WalletServices.sendMoneyToWallet(req.body, varifiedToken as JwtPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Send Money to user's account completed successfully",
        data: wallet
    });
});

const cashInToUserWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const varifiedToken = req.user;
    const wallet = await WalletServices.cashInToUserWallet(req.body, varifiedToken as JwtPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Cash In to user's account completed successfully",
        data: wallet
    });
});

const cashOutFromUserWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const varifiedToken = req.user;
    const wallet = await WalletServices.cashOutFromUserWallet(req.body, varifiedToken as JwtPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Cash out from user's account completed successfully",
        data: wallet
    });
});

export const WalletControllers = {
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