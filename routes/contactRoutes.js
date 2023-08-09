import express from 'express';
import { createContactController } from '../controller/contactController.js';
// import { requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();


//routing

// create || method post
router.post('/create-comment', createContactController);

// get || method get
// router.get('/get-contact', requireSignIn, getContactController);


export default router; 