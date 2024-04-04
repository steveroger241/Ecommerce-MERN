import mongoose from "mongoose";
import categoryModel from "./categoryModel.js";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    price: {type: Number, required: true, trim: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'categorySchema', required: true},
    // quantity: {type: Number, required: true},
    photo: {type: String},
    cloudinaryid: {type: String},
    // shipping: {type: Boolean, required: true}
}, { timestamps: true });

const productModel = mongoose.model('productSchema', productSchema);

export default productModel;