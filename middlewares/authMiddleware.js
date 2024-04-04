import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.secretkey;
import nodemailer from 'nodemailer';

export async function verifyToken(req, res, next) {
    try {
        if(req.headers.authorization){
            const decode = jwt.verify(req.headers.authorization, secretKey);
            req.sameName = decode;
            next();
        }
        else{
            return;
        }
    }
    catch (err) {
        return res.send("Internal server error");
    }
}

export async function isAdmin(req, res, next) {
    try {
        const result = await userModel.findById(req.sameName._id);
        if (result.role !== 1) {
            return res.send("You're not admin");
        }
        else {
            next();
        }
    }
    catch (err) {
        return res.send("Internal server error");
    }
}

export async function verifyMail(req, res, next) {
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'yb9203232@gmail.com',
                pass: 'steveroger'
            }
        });
        const info = await transporter.sendMail({
            from: "yurib9432@gmail.com",
            to: "boykayuri908@gmail.com",
            subject: "Otp",
            text: "Otp is falana don't share"
        });        
        next();
    }
    catch (err) {
        return res.send({
            success: false,
            error: "Internal server error in signup"
        });
    }
};