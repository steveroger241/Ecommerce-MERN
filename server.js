import express from 'express';
import connectdb from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

connectdb();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, './client/build')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

app.use('*', (req, res)=>{
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

app.listen(process.env.port);