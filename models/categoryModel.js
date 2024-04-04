import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
}, { timestamps: true })

const categoryModel = mongoose.model('categorySchema', categorySchema);

export default categoryModel;