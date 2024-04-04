import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

function connectdb() {
    mongoose.
        connect(process.env.mongo)
        .then(() => {
            console.log("Mongo db is connected");
        })
        .catch((err) => {
            console.log("Mongo db is not connected yet --> ", err," <--");
        })
}

export default connectdb;