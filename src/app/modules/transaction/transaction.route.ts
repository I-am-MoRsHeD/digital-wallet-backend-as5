import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.get('/', checkAuth(Role.ADMIN), TransactionController.getAllTransactions);
router.get('/me', checkAuth(Role.USER, Role.AGENT), TransactionController.getTransactionsForDecodedUser);

export const transactionRoutes = router;