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

// const blockUserWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const wallet = await WalletServices.blockUserWallet(id, req.body);

//     sendResponse<IWallet>(res, {
//         statusCode: 200,
//         success: true,
//         message: "User wallet blocked successfully",
//         data: wallet
//     });
// });

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await WalletServices.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Your wallet retrieved successfully",
        data: result
    })
})

// user's wallet actions
const withdrawWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const varifiedToken = req.user;
    const result = await WalletServices.withdrawWallet(req.body, varifiedToken as JwtPayload);

    sendResponse<{ userWallet: IWallet; agentWallet: IWallet }>(res, {
        statusCode: 200,
        success: true,
        message: "Withdraw completed successfully",
        data: result
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

// agent's wallet actions
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

export const WalletControllers = {
    getAllWallets,
    getMe,
    withdrawWallet,
    sendMoneyToWallet,
    cashInToUserWallet,
}