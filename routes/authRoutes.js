import express from 'express';
import { getAllOrder, getOrder, loginController, registerController, testController, updateProfileController, updateStatus } from '../controllers/authController.js'
import { isAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();   

router.post('/register', registerController);
router.post('/login', loginController);
router.put('/profile/:email', verifyToken, updateProfileController);
router.get('/orders/:buyerid', verifyToken, getOrder);
router.get('/allorders', verifyToken, getAllOrder);
router.put('/updatestatus', verifyToken, isAdmin, updateStatus)

export default router;