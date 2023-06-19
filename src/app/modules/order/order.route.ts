import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { orderController } from './order.controller';
import orderZodSchema from './order.validation';


const OrderRouter = Router();

// create
OrderRouter.post(
  '/',
  validateRequest(orderZodSchema),
  orderController.createOrder
);

// find
OrderRouter.get('/:id', orderController.getSingleOrder);

// get all
OrderRouter.get('/', orderController.getOrders);

export default OrderRouter;
