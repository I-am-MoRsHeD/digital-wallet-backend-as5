import { Router } from "express";
import { WalletControllers } from "./wallet.controller";
import { validateSchema } from "../../middlewares/validateSchema";
import { updateWalletValidation } from "./wallet.validation";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get('/', checkAuth(Role.ADMIN), WalletControllers.getAllWallets);
router.patch('/block-unblock/:id', checkAuth(Role.ADMIN), WalletControllers.blockUserWallet);

router.get('/user', checkAuth(Role.USER), WalletControllers.getUserWallet);
router.post('/user/top-up', checkAuth(Role.USER), validateSchema(updateWalletValidation), WalletControllers.topUpWallet);
router.post('/user/withdraw', checkAuth(Role.USER), validateSchema(updateWalletValidation), WalletControllers.withdrawWallet);
router.post('/user/send-money', checkAuth(Role.USER), WalletControllers.sendMoneyToWallet);

router.get('/agent', checkAuth(Role.AGENT), WalletControllers.getAgentWallet);
router.post('/agent/cash-in', checkAuth(Role.AGENT), WalletControllers.cashInToUserWallet);
router.post('/agent/cash-out', checkAuth(Role.AGENT), WalletControllers.cashOutFromUserWallet);

// router.get('/:id');
// router.patch('/:id');

export const walletRoutes = router;