import express from "express";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, getAllCategoryController, getOneCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

router.post('/createcategory', verifyToken, isAdmin, createCategoryController);
router.put('/updatecategory/:id', verifyToken, isAdmin, updateCategoryController);
router.delete('/deletecategory/:id', verifyToken, isAdmin, deleteCategoryController); 
router.get('/getall', getAllCategoryController);
router.get('/getone/:name', getOneCategoryController);

export default router;