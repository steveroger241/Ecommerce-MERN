import cloudinary from 'cloudinary'
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});

const razorpay = new Razorpay({
    key_id: process.env.razorpay_key_id,
    key_secret: process.env.razorpay_key_secret
});

export { cloudinary, razorpay }; 