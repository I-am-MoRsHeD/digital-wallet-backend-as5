import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.get('/', checkAuth(Role.ADMIN), TransactionController.getAllTransactions);
router.get('/me', checkAuth(Role.USER, Role.AGENT), TransactionController.getTransactionsForDecodedUser);

router.get('/cash-in', checkAuth(Role.USER), TransactionController.getCashInTransactions);
router.get('/withdraw', checkAuth(Role.AGENT), TransactionController.getWithdrawTransactions);

export const transactionRoutes = router;