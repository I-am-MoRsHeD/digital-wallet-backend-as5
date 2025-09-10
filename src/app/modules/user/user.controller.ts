/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse<IUser>(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user
    });
});

const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserServices.getAllUser(query as Record<string, string>);

    sendResponse<IUser[]>(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully",
        data: result.data
    });
});

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Your profile retrieved successfully",
        data: result
    })
})

const singleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await UserServices.singleUser(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        data: user
    });
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;
    const verifiedToken = req.user;

    const user = await UserServices.updateUser(id, payload, verifiedToken as JwtPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: user
    });
});

const blockUnblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UserServices.blockUnblockUser(id);

    sendResponse<IUser>(res, {
        statusCode: 200,
        success: true,
        message: "User managed successfully",
        data: result
    });
});

const approveOrSuspendAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UserServices.approveOrSuspendAgent(id);

    sendResponse<IUser>(res, {
        statusCode: 200,
        success: true,
        message: "Agent managed successfully",
        data: result
    });
});


export const UserControllers = {
    createUser,
    getAllUser,
    getMe,
    singleUser,
    updateUser,
    blockUnblockUser,
    approveOrSuspendAgent
}