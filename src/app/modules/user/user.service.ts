/* eslint-disable @typescript-eslint/no-explicit-any */

import { IPaginationOptions } from '../../../interface/pagination';
import { userSearchableFields } from './user.constant';
import { IUser, IUserFilterOptions } from './user.interface';
import User from './user.model';

// create user service start
const createUser = async (payload: IUser) => {
  const result = await User.create(payload);
  return result;
};

const getAllUser = async (
  filterOptions: IUserFilterOptions,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sort } = paginationOptions;
  const { searchTerm, ...filterFields } = filterOptions;

  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filterFields).length) {
    andCondition.push(
      ...Object.entries(filterFields).map(([field, value]) => ({
        [field]: value,
      }))
    );
  }

  const whereCondition = andCondition.length ? { $and: andCondition } : {};

  const result = await User.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .lean();
  const total = await User.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

// update user
const updateUser = async (id: string, payload: Partial<IUser>) => {
  const { name, ...userData } = payload;

  if (name && Object.keys(name).length) {
    Object.entries(name).forEach(([field, value]) => {
      (userData as any)[`name.${field}`] = value;
    });
  }

  // update user data
  const result = await User.findOneAndUpdate({ _id: id }, userData, {
    new: true,
  });

  return result;
};

// get single user
const getSingleUser = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

// delete user
const deleteUser = async (id: string) => {
  const result = await User.findOneAndDelete({ _id: id });
  return result;
};

export const UserService = {
  createUser,
  getAllUser,
  updateUser,
  getSingleUser,
  deleteUser,
};
