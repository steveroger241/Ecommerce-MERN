import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    role: { type: Number, default: 0 }
}, { timestamps: true });

const userModel = mongoose.model('userSchema', userSchema);

export default userModel;