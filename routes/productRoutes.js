import express from 'express'
import { isAdmin, verifyToken } from '../middlewares/authMiddleware.js';
import { createProductController, deleteProductController, getAllProductController, getOneProductController, postPaymentOrderController, productCountController, productFilterController, productListController, relatedProductController, searchProductController, updateProductController, verifyPaymentController } from '../controllers/productController.js';
import { mult } from '../middlewares/productImageMiddleware.js';


const router = express.Router();

router.post('/createproduct', verifyToken, isAdmin, mult.single('photo'), createProductController);
router.put('/updateproduct/:id', verifyToken, isAdmin, mult.single('photo'), updateProductController);
router.delete('/deleteproduct/:id', verifyToken, isAdmin, deleteProductController);
router.get('/getone/:name', getOneProductController);
router.get('/getall', getAllProductController);

router.post('/productfilter', productFilterController);
router.get('/productcount', productCountController);
router.get('/productlist/:page', productListController);

router.get('/search/:keywords', searchProductController);
router.get('/relatedproduct/:pid/:cid', relatedProductController);


router.post('/order', postPaymentOrderController);
router.post('/orderverify', verifyPaymentController);

export default router;