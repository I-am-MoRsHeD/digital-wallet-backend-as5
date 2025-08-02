import { z } from "zod";

export const updateWalletValidation = z.object({
    walletName: z
        .string({ invalid_type_error: "walletName must be string" })
        .min(2, { message: "walletName must be at least 2 characters long." })
        .max(50, { message: "walletName cannot exceed 50 characters." }).optional(),
    balance: z
        .number({ invalid_type_error: "balance must be number" })
        .min(1, { message: "balance must be at least 1." }).optional(),
});