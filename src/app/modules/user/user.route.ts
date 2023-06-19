import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { UserValidator } from './user.validation';

const UserRouter = Router();

// create user
UserRouter.post(
  '/create-user',
  validateRequest(UserValidator.createUserZodSchema),
  UserController.createUser
);

// get all user
UserRouter.patch(
  '/:id',
  validateRequest(UserValidator.updateUserZodSchema),
  UserController.updateUser
);

// get single user
UserRouter.get('/:id', UserController.getSingleUser);

// delete user
UserRouter.delete('/:id', UserController.deleteUser);

// get all user
UserRouter.get('/', UserController.getAllUser);

export default UserRouter;
