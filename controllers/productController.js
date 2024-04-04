import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import { cloudinary } from "../helpers/productHelper.js";
import { razorpay } from "../helpers/productHelper.js";
import crypto from 'crypto';

export async function createProductController(req, res) {
    try {
        if (!req.body.name) {
            return res.send({ error: "name is required" });
        }
        if (!req.body.description) {
            return res.send({ error: "description is required" });
        }
        if (!req.body.category) {
            return res.send({ error: "category is required" });
        }
        // if (!req.body.quantity) {
        //     return res.send({ error: "quantity is required" });
        // }
        if (!req.body.price) {
            return res.send({ error: "price is required" });
        }
        // if (!req.body.shipping) {
        //     return res.send({ error: "shipping is required" });
        // }

        let inputString = req.body.name;
        let newStr = inputString.trim().replace(/\s+/g, "-");

        // const match = await productModel.findOne({ name: newStr });
        // if (match) {
        //     return res.send({ error: "Product name already exist" })
        // }

        const photo = await cloudinary.uploader.upload(req.file.path);

        const result = await productModel.create({
            name: newStr,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            // quantity: req.body.quantity,
            photo: photo.secure_url,
            cloudinaryid: photo.public_id,
            // shipping: req.body.shipping
        });

        if (result) {
            return res.send({
                success: true,
                message: "Product created successfully",
                result
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
            error: "Inernal server error while creating product"
        })
    }
}

export async function getAllProductController(req, res) {
    try {
        let result = await productModel.find({}).sort({ createdAt: -1 });

        if (result) {
            return res.send({
                success: true,
                result
            })
        } else {
            return res.send({
                success: false,
                error: "No products available"
            })
        }
    }
    catch (err) {

        return res.send({
            success: false,
            error: "Internal server error while getting all product"
        })
    }
}

export async function getOneProductController(req, res) {
    try {

        let id = req.params.name;
        // let newStr = inputString.trim().replace(/\s+/g, "-");

        let result = await productModel.findOne({ _id: id });

        if (result) {
            return res.send({
                success: true,
                result
            });
        }
        else {
            return res.send("No product available with such name");
        }
    }
    catch (err) {

        return res.send({
            success: false,
            error: "Internal server error in getting particular product"
        })
    }
}

export async function updateProductController(req, res) {
    try {

        if (!req.body.name) {
            return res.send({ error: "name is required" });
        }
        if (!req.body.description) {
            return res.send({ error: "description is required" });
        }
        if (!req.body.category) {
            return res.send({ error: "category is required" });
        }
        // if (!req.body.quantity) {
        //     return res.send({ error: "quantity is required" });
        // }
        if (!req.body.price) {
            return res.send({ error: "price is required" });
        }
        // if (!req.body.shipping) {
        //     return res.send({ error: "shipping is required" });
        // }
        let result = await productModel.findOne({ _id: req.params.id })

        if (result) {

            let inputString = req.body.name;
            let newStr = inputString.trim().replace(/\s+/g, "-");

            let cldrem = await cloudinary.uploader.destroy(result.cloudinaryid);

            let cldadd = await cloudinary.uploader.upload(req.file.path);

            let reslt = await productModel.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        name: newStr,
                        description: req.body.description,
                        price: req.body.price,
                        category: req.body.category,
                        // quantity: req.body.quantity,
                        photo: cldadd.secure_url,
                        cloudinaryid: cldadd.public_id,
                        // shipping: req.body.shipping
                    }
                }
            );

            if (cldrem && reslt) {
                return res.send({
                    success: true,
                    message: "Updated successfully"
                })
            }
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            });
        }
    }
    catch (err) {

        return res.send({
            success: false,
            error: "Internal server error while updating product from backend"
        })
    }
}

export async function deleteProductController(req, res) {
    try {
        let result = await productModel.findOne({ _id: req.params.id });

        if (result) {
            let cld = await cloudinary.uploader.destroy(result.cloudinaryid);
            let reslt = await productModel.deleteOne({ _id: req.params.id });

            if (cld && reslt) {
                return res.send({
                    success: true,
                    message: "Product deleted successfully"
                })
            }
            if (cld) {
                return res.send({
                    success: true,
                    message: "Only Cloudinary deleted but not the mongo"
                })
            }
            if (reslt) {
                return res.send({
                    success: true,
                    message: "Only Mongo deleted but not the Cloudinary"
                })
            }
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            });
        }

    }
    catch (err) {

        return res.send({
            success: false,
            error: "Internal server error while deleting product"
        })
    }
}



export async function productFilterController(req, res) {
    try {
        if (req.body.check.length > 0 && req.body.radio.length === 0) {
            let result = await productModel.find({ category: req.body.check }).sort({ createdAt: -1 });

            if (result) {
                return res.send({
                    success: true,
                    result
                });
            }
            else {
                return res.send({
                    success: false,
                    error: "Error in query but not the server error"
                });
            }
        }

        else if (req.body.check.length === 0 && req.body.radio.length > 0) {
            let result = await productModel.find(
                { price: { $gte: req.body.radio[0], $lte: req.body.radio[1] } }
            ).sort({ createdAt: -1 });

            if (result) {
                return res.send({
                    success: true,
                    result
                });
            }
            else {
                return res.send({
                    success: false,
                    error: "Error in query but not the server error"
                });
            }
        }

        else if (req.body.check.length > 0 && req.body.radio.length > 0) {
            let result = await productModel.find(
                { category: req.body.check, price: { $gte: req.body.radio[0], $lte: req.body.radio[1] } }
            ).sort({ createdAt: -1 });

            if (result) {
                return res.send({
                    success: true,
                    result
                });
            }
            else {
                return res.send({
                    success: false,
                    error: "Error in query but not the server error"
                });
            }
        }
    }
    catch (err) {

        return res.send({
            success: false,
            error: "Internal server error while filtering product"
        })
    }
}


export async function productCountController(req, res) {
    try {
        let total = await productModel.find({}).estimatedDocumentCount();

        if (total) {
            return res.send({
                success: true,
                total
            });
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            });
        }
    }
    catch (err) {

        return res.send({
            success: false,
            error: "Internal server error while counting product"
        })
    }
}


export async function productListController(req, res) {
    try {
        const perpage = 4;
        const page = req.params.page ? req.params.page : 1;

        const product = await productModel
            .find({})
            .skip((page - 1) * perpage)
            .limit(perpage)
            .sort({ createdAt: -1 });

        if (product) {
            return res.send({
                success: true,
                product
            });
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            });
        }
    }
    catch (err) {

        return res.send({
            success: false,
            error: "Internal server error while listing product"
        })
    }
}


export async function searchProductController(req, res) {
    try {
        const result = await productModel.find({
            $or: [
                { name: { $regex: req.params.keywords, $options: "i" } },
                { description: { $regex: req.params.keywords, $options: "i" } }
            ]
        }).sort({ createdAt: -1 });


        if (result && result.length > 0) {
            return res.send({
                success: true,
                result
            });
        }


        else {
            const searchQuery = req.params.keywords;
            const keywords = searchQuery.replace(/\s+/g, "[- ]");

            const result = await productModel.find({
                $or: [
                    { name: { $regex: keywords, $options: "i" } },
                    { description: { $regex: keywords, $options: "i" } }
                ]
            }).sort({ createdAt: -1 });


            if (result && result.length > 0) {
                return res.send({
                    success: true,
                    result
                });
            }
            else {
                return res.send({
                    success: false,
                    error: "Error in query but not the server error"
                });
            }
        }
    }
    catch (err) {

        return res.send({
            success: false,
            error: "Internal server error while searching products"
        })
    }
}

export async function relatedProductController(req, res) {
    try {
        const result = await productModel
            .find({ category: req.params.cid, _id: { $ne: req.params.pid } }).sort({ createdAt: -1 });


        if (result) {
            return res.send({
                success: true,
                result
            });
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            });
        }
    }
    catch (err) {

        return res.send({
            success: false,
            error: "Internal server error while searching related products"
        })
    }
}



export async function postPaymentOrderController(req, res) {
    try {
        if (!req.body.amount) {
            return res.send({ error: "amount is required" });
        }
        if (!req.body.currency) {
            return res.send({ error: "currency is required" });
        }
        if (!req.body.receipt) {
            return res.send({ error: "receipt is required" });
        }

        const order = await razorpay.orders.create({
            amount: req.body.amount,
            currency: req.body.currency,
            receipt: req.body.receipt
        });


        if (order) {
            return res.send({
                success: true,
                order
            });
        }
        else {
            return res.send({
                success: false,
                error: "Error in query but not the server error"
            });
        }
    }
    catch (err) {

        return res.send({
            success: false,
            error: err.error.description
        })
    }
}


export async function verifyPaymentController(req, res) {
    try {
        const sha = crypto.createHmac("sha256", razorpay.key_secret);
        sha.update(`${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`);

        const digest = sha.digest("hex");

        if (digest === req.body.razorpay_signature) {


            const result = await orderModel.create({
                buyer: req.body.name,
                buyerId: req.body.id,
                product: req.body.productname,
                productId: req.body.productid,
                orderId: req.body.razorpay_order_id,
                payment: req.body.payment,
                paymentId: req.body.razorpay_payment_id,

            });

            if (result) {
                return res.send({
                    success: true,
                    message: "Payment successful",
                    orderId: req.body.razorpay_order_id,
                    paymentId: req.body.razorpay_payment_id
                })
            }
            else {
                return res.send({
                    success: false,
                    error: "Error in Mongo query but not the server error"
                });
            }
        }
        else {
            return res.send({
                success: false,
                error: "Error in Razorpay query but not the server error"
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.send({
            success: false,
            error: "Internal server error while verifying payment"
        })
    }
}