"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const UserRouter = (0, express_1.Router)();
// create user
UserRouter.post('/create-user', (0, validateRequest_1.default)(user_validation_1.UserValidator.createUserZodSchema), user_controller_1.UserController.createUser);
// get all user
UserRouter.patch('/:id', (0, validateRequest_1.default)(user_validation_1.UserValidator.updateUserZodSchema), user_controller_1.UserController.updateUser);
// get single user
UserRouter.get('/:id', user_controller_1.UserController.getSingleUser);
// delete user
UserRouter.delete('/:id', user_controller_1.UserController.deleteUser);
// get all user
UserRouter.get('/', user_controller_1.UserController.getAllUser);
exports.default = UserRouter;
