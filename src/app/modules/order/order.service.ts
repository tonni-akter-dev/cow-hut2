import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import User from '../user/user.model';
import { IOrder } from './order.interface';
import CowModel from '../cow/cow.model';
import mongoose from 'mongoose';
import Order from './order.model';
import { IPaginationOptions } from '../../../interface/pagination';

const createOrder = async (payload: IOrder) => {
  const { cow, buyer } = payload;

  // buyer check start here
  const buyerData = await User.findOne({ _id: buyer });
  if (!buyerData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Buyer not found. Please provide a valid buyer id'
    );
  } else if (buyerData.role !== 'buyer') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Buyer not found. Please provide a valid buyer id'
    );
  }

  // cow check start here //
  const cowData = await CowModel.findOne({ _id: cow });
  if (!cowData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Cow not found. Please select another cow'
    );
  } else if (cowData.label === 'sold out') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cow already sold. Please select another cow'
    );
  }

  // less than cow price then throw error
  if (buyerData.budget < cowData.price) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Insufficient budget. Please top up your account to proceed with this order'
    );
  }

  const sellerId = cowData.seller;
  let createdOrderId;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // update cow label
    const cowUpdated = await CowModel.updateOne(
      { _id: cow },
      { label: 'sold out' },
      { session }
    );

    if (!cowUpdated.acknowledged) {
      throw new Error('Something went wrong. Please try again');
    }

    // update buyer budget
    const buyerUpdated = await User.updateOne(
      { _id: buyer },
      { $inc: { budget: -cowData.price } },
      { session }
    );

    if (!buyerUpdated.acknowledged) {
      throw new Error('Something went wrong. Please try again');
    }

    // update seller income to seller income + cow price
    const sellerUpdated = await User.updateOne(
      { _id: sellerId },
      { $inc: { income: cowData.price } },
      { session }
    );

    if (!sellerUpdated.acknowledged) {
      throw new Error('Something went wrong. Please try again');
    }

    // create order
    const createResult = await Order.create([payload], { session });

    if (!createResult || createResult.length === 0) {
      throw new Error('Something went wrong. Please try again');
    }

    createdOrderId = createResult[0]._id;

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Something went wrong. Please try again'
    );
  } finally {
    session.endSession();
  }

  // finally order created successfully
  const createdOrder = await Order.findOne({ _id: createdOrderId })
    .populate({
      path: 'cow',
      populate: [
        {
          path: 'seller',
        },
      ],
    })
    .populate('buyer');

  return createdOrder;
};

// get all orders
const getOrders = async (
  paginationOptions: IPaginationOptions,
  filterOptions: { buyer?: string }
) => {
  const { buyer } = filterOptions;
  const { page, limit, skip, sort } = paginationOptions;

  const query = buyer ? { buyer } : {};

  const orders = await Order.find(query)
    .populate({
      path: 'cow',
      populate: [
        {
          path: 'seller',
        },
      ],
    })
    .populate('buyer')
    .skip(skip)
    .limit(limit)
    .sort(sort);

  const total = await Order.countDocuments(query);

  return {
    data: orders,
    meta: {
      total,
      page,
      limit,
    },
  };
};

// get single order
const getSingleOrder = async (id: string) => {
  const result = Order.findOne({ _id: id })
    .populate({
      path: 'cow',
      populate: [
        {
          path: 'seller',
        },
      ],
    })
    .populate('buyer');

  return result;
};

export const orderService = {
  createOrder,
  getOrders,
  getSingleOrder,
};
