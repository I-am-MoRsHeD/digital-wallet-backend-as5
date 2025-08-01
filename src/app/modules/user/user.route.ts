import { Router } from 'express';
import { UserControllers } from './user.controller';

const router = Router();

router.post('/register', UserControllers.createUser);
router.get('/', UserControllers.getAllUser);
// router.get('/:id');
// router.patch('/:id');
// router.delete('/:id');

export const userRoutes = router;