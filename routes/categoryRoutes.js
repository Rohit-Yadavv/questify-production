import express from 'express';
import { getSingleCategoryController, createCategoryController, updateCategoryController, getAllCategoriesController, deleteCategoryController } from '../controller/categoryController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();


//routing

// create || method post
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);


// update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

// get all category
router.get('/get-categories', getAllCategoriesController)

//single category
router.get("/single-category/:slug", getSingleCategoryController);

//delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController);



export default router; 