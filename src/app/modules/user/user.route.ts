import { Router } from 'express';
import { UserControllers } from './user.controller';
import { checkAuth } from '../../utils/checkAuth';
import { Role } from './user.interface';
import { validateSchema } from '../../middlewares/validateSchema';
import { changePasswordZodSchema, createUserZodSchema, updateUserZodSchema } from './user.validation';

const router = Router();

router.post('/register', validateSchema(createUserZodSchema), UserControllers.createUser);
router.get('/',
    checkAuth(Role.ADMIN),
    UserControllers.getAllUser);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
router.get('/:id', UserControllers.singleUser);
router.patch('/:id',
    checkAuth(...Object.values(Role)),
    validateSchema(updateUserZodSchema),
    UserControllers.updateUser);
router.patch('/change-password/:id',
    checkAuth(...Object.values(Role)),
    validateSchema(changePasswordZodSchema),
    UserControllers.changePassword);

router.patch('/block-unblock/:id',
    checkAuth(Role.ADMIN),
    UserControllers.blockUnblockUser);
router.patch('/approve-suspend/:id',
    checkAuth(Role.ADMIN),
    UserControllers.approveOrSuspendAgent);

export const userRoutes = router;