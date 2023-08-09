import express from 'express';

import { registerController, updateProfileController, loginController, forgetPasswordController, testController } from "../controller/authController.js";
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';

//router object
const router = express.Router();

//routing

//register || method post 
router.post('/register', registerController);

//LOGIN || method post 
router.post('/login', loginController);

//forget password || method post 
router.post('/forget-password', forgetPasswordController);

//update profile
router.put("/update-profile", requireSignIn, updateProfileController);


//test-routes
router.get('/test', requireSignIn, isAdmin, testController);

//protected-routes-auth
router.get('/user-auth', requireSignIn, (req, res) => { res.status(200).send({ ok: true }) });

//protected-routes-auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => { res.status(200).send({ ok: true }) });




export default router;