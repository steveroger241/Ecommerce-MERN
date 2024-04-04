import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.secretkey;

export async function registerController(req, res) {
    try {        
        if (!req.body.name) {
            return res.send({ error: "name is required" });
        }
        if (!req.body.email) {
            return res.send({ error: "email is required" });
        }
        if (!req.body.password) {
            return res.send({ error: "password is required" });
        }
        if (!req.body.phone) {
            return res.send({ error: "phone is required" });
        }
        if (!req.body.address) {
            return res.send({ error: "address is required" });
        }
        
        const existinguser = await userModel.findOne({ email: req.body.email });
        if (existinguser) {
            return res.send({ error: "Email already exist do login" });
        }
        
        const hashedPassword = await hashPassword(req.body.password);  
        
        const result = await userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            address: req.body.address
        });
        
        const token = jwt.sign({ _id: result._id }, secretKey, { expiresIn: "7d" });
        
        if (result) {
            return res.send({
                success: true,
                message: "User registration successful",
                user: {
                    id: result._id,
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    address: result.address,
                    role: result.role,
                },
                token
            });
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            })
        }
    }
    catch (err) {
        console.log("Error is: ", err);
        return res.send({
            success: false,
            error: "Internal server error in signup"
        });
    }
}



export async function loginController(req, res) {
    try {
        
        if (!req.body.email || !req.body.password) {
            return res.send({ error: "All fields are required" });
        }
        
        let result = await userModel.findOne({ email: req.body.email });
        if (!result) {
            return res.send({ error: "Email doesn't exist do register or signup" });
        }
        
        const match = await comparePassword(req.body.password, result.password);  
        
        if (!match) {
            return res.send({ error: "Wrong password" });
        }
        
        const token = jwt.sign({ _id: result._id }, secretKey, { expiresIn: "7d" });
        
        if (result) {
            return res.send({
                success: true,
                message: "Login successful",
                user: {
                    id: result._id,          
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    address: result.address,
                    role: result.role,
                },
                token
            });
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            })
        }
    }
    catch (err) {
        console.log("Error is: ", err);
        return res.send({
            success: false,
            error: "Internal server error in login"
        });
    }
}


export function testController(req, res) {
    return res.send("Protected route accessed");
}


export async function updateProfileController(req, res) {
    try {
        if (!req.body.name || !req.body.email || !req.body.password || !req.body.phone || !req.body.address) {
            return res.send({ error: "All fields are required" });
        }
        
        const hashedPassword = await hashPassword(req.body.password);

        const updatedDetails = await userModel.updateOne({ email: req.params.email }, { $set: { name: req.body.name, password: hashedPassword, phone: req.body.phone, address: req.body.address } })

        if (updatedDetails) {
            let result = await userModel.findOne({ email: req.params.email });
            if (result) {
                return res.send({
                    success: true,
                    message: "Updated successfully",
                    user: {
                        id: result._id,          
                        name: result.name,
                        email: result.email,
                        phone: result.phone,
                        address: result.address,
                        role: result.role,
                    },
                });
            }
            else {
                return res.send({
                    success: false,
                    error: "Error in query but not the server error"
                })
            }
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            })
        }
    }
    catch (err) {
        console.log("Error is: ", err);
        return res.send({
            success: false,
            error: "Internal server error while updating profile"
        });
    }
}

export async function getOrder(req, res) {
    try {
        
        const result = await orderModel
            .find({ buyerId: req.params.buyerid })
            .populate('productId') 
            .sort({ createdAt: -1 });

        let createdat = result.map(dt => dt.createdAt);   

        let formattedDate = createdat.map(timestamp => {
            let date = new Date(timestamp);
            const day = date.getDate().toString().padStart(2, '0'); 
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        })
        
        let edit = result.map(data => data.toObject()) 
        let results = edit.map((data, index) => {      
            return { ...data, date: formattedDate[index] }
        })
        
        if (result) {
            return res.send({
                success: true,
                
                result: results
            })
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            })
        }
    }
    catch (err) {
        console.log("Error is: ", err);
        return res.send({
            success: false,
            error: "Internal server error in getting particular order"
        });
    }
}


export async function getAllOrder(req, res) {
    try {

        const result = await orderModel
            .find({})
            .populate('productId')
            .populate('buyerId', 'name email phone address')
            .sort({ createdAt: -1 });

        let createdat = result.map(dt => dt.createdAt);

        let formattedDate = createdat.map(timestamp => {
            let date = new Date(timestamp);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        })

        
        let edit = result.map(data => data.toObject())
        let results = edit.map((data, index) => {
            return { ...data, date: formattedDate[index] }
        });
        
        
        if (result) {
            return res.send({
                success: true,
                result: results
            })
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            })
        }
    }
    catch (err) {
        console.log("Error is: ", err);
        return res.send({
            success: false,
            error: "Internal server error in getting all orders"
        });
    }
}

export async function updateStatus(req, res) {
    try {
        let result = await orderModel.updateOne({ orderId: req.body.id }, { $set: { status: req.body.status } });

        if (result) {
            return res.send({
                success: true,
                message: "Updated successfully"
            });
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            })
        }
    }
    catch (err) {
        
        return res.send({
            success: false,
            error: "Internal server error in changing status"
        })
    }
}