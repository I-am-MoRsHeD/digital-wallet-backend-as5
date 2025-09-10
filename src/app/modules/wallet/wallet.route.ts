import { Router } from "express";
import { WalletControllers } from "./wallet.controller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get('/', checkAuth(Role.ADMIN), WalletControllers.getAllWallets);
// router.patch('/block-unblock/:id', checkAuth(Role.ADMIN), WalletControllers.blockUserWallet);
router.get("/me", checkAuth(Role.USER, Role.AGENT), WalletControllers.getMe); // \/

router.post('/user/withdraw', checkAuth(Role.USER), WalletControllers.withdrawWallet); // \/
router.post('/user/send-money', checkAuth(Role.USER), WalletControllers.sendMoneyToWallet); // \/

router.post('/agent/cash-in', checkAuth(Role.AGENT), WalletControllers.cashInToUserWallet); // \/

export const walletRoutes = router;