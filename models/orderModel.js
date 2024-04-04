import mongoose from "mongoose";
import userModel from "./userModel.js";

const orderSchema = new mongoose.Schema({
    buyer: {type: String, required: true},
    buyerId: {type: mongoose.Schema.Types.ObjectId, ref: 'userSchema', required: true},
    product: [{type: String, required: true}],
    productId: [{type: mongoose.Schema.Types.ObjectId, ref: 'productSchema', required: true}], // Array of object because more than 1 product can also be purchased
    orderId: {type: String, required: true},
    payment: {},
    paymentId: {type: String, required: true},
    status: {type: String, required: true, default: "Processing", enum: ["Processing", "Shipped", "Delivered", "Cancelled"]} // enum is like select tag of html
}, {timestamps: true});

const orderModel = mongoose.model('orderSchema', orderSchema);

export default orderModel;