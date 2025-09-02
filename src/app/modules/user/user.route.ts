import { Router } from 'express';
import { UserControllers } from './user.controller';
import { checkAuth } from '../../utils/checkAuth';
import { Role } from './user.interface';
import { validateSchema } from '../../middlewares/validateSchema';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';

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

export const userRoutes = router;