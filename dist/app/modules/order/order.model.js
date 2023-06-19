"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    cow: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Cow',
        required: true,
    },
    buyer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true, toJSON: { virtuals: true } });
const Order = (0, mongoose_1.model)('Order', OrderSchema);
exports.default = Order;
