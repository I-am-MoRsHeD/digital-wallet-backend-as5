/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { setCookies } from "../../utils/setCookies";


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    setCookies(res, loginInfo);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data: loginInfo
    })
});

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged out successfully",
        data: null
    })
});



export const AuthControllers = {
    credentialsLogin,
    logout
}