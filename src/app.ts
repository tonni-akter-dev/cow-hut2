import express, { Application } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import UserRouter from './app/modules/user/user.route';
import CowRouter from './app/modules/cow/cow.route';
import OrderRouter from './app/modules/order/order.route';

const app: Application = express();

// Application credential
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// All Router
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/cows', CowRouter);
app.use('/api/v1/orders', OrderRouter);
app.use(globalErrorHandler);

// this is not found middleware
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    message: 'Not Found',
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    errorMessages: [
      {
        message: 'Not Found',
        path: req.originalUrl,
      },
    ],
  });

  next();
});

export default app;
