import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = Router();

router.get('/agent', checkAuth(Role.AGENT), StatsController.getAgentTransactionOverview);
router.get('/admin', checkAuth(Role.ADMIN), StatsController.getAdminStats);



export const statsRoutes = router;