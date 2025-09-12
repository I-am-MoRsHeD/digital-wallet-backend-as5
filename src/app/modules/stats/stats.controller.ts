/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsServices } from "./stats.service";
import { JwtPayload } from "jsonwebtoken";


const getAgentTransactionOverview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const verifiedUser = req.user;
    const result = await StatsServices.getAgentTransactionOverview(verifiedUser as JwtPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Agent stats retrieved successfully",
        data: result
    });
});

const getAdminStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const verifiedUser = req.user;
    const result = await StatsServices.getAdminStats(verifiedUser as JwtPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin stats retrieved successfully",
        data: result
    });
});

export const StatsController = {
    getAgentTransactionOverview,
    getAdminStats
};