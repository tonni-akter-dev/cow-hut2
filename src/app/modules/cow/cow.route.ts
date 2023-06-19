import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { CowValidator } from './cow.validation';
import { CowController } from './cow.controller';

const CowRouter = Router();
// create
CowRouter.post(
  '/create-cow',
  validateRequest(CowValidator.createCowZosSchema),
  CowController.createCow
);

// update
CowRouter.patch(
  '/:id',
  validateRequest(CowValidator.updateCowZodSchema),
  CowController.updateCow
);

// find
CowRouter.get('/:id', CowController.getSingleCow);

// delete
CowRouter.delete('/:id', CowController.deleteCow);

// get all
CowRouter.get('/', CowController.getAllCow);

export default CowRouter;
