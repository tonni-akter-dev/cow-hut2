"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const user_route_1 = __importDefault(require("./app/modules/user/user.route"));
const cow_route_1 = __importDefault(require("./app/modules/cow/cow.route"));
const order_route_1 = __importDefault(require("./app/modules/order/order.route"));
const app = (0, express_1.default)();
// Application credential
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// All Router
app.use('/api/v1/users', user_route_1.default);
app.use('/api/v1/cows', cow_route_1.default);
app.use('/api/v1/orders', order_route_1.default);
app.use(globalErrorHandler_1.default);
// this is not found middleware
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        message: 'Not Found',
        statusCode: http_status_1.default.NOT_FOUND,
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
exports.default = app;
