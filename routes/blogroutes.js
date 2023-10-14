import express from 'express';
import { getOgImage,getRelatedBlogsController, checkBlogLiked, getLikedArticles, getLatestBlogs, likeBlogController, getBlogPhotoController, deleteBlogController, createBlogController, getAllBlogsController, getSingleBlogController, updateBlogController } from '../controller/blogController.js';
import formidable from 'express-formidable';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
const router = express.Router();


//routing

// create || method post
router.post('/create-blog', requireSignIn, isAdmin, formidable(), createBlogController);

// update blogs
router.put('/update-blog/:bid', requireSignIn, isAdmin, formidable(), updateBlogController);

// get all blogs
router.get('/all-blogs', formidable(), getAllBlogsController);

//single blog 
router.get("/get-blog/:slug", formidable(), getSingleBlogController);

//single blog
router.get("/related-blogs/:pid/:cid", formidable(), getRelatedBlogsController);

//get photo
router.get("/blog-photo/:pid", getBlogPhotoController);

//delete blog
router.delete("/delete-blog/:bid", requireSignIn, isAdmin, deleteBlogController);

// latest blogs
router.get("/get-latest-blogs", getLatestBlogs);

// Check if the current user has liked the blog
router.get("/check-blog-liked/:bid", requireSignIn, checkBlogLiked);

// like blog
router.post('/like-blog/:bid', requireSignIn, likeBlogController);

// get all liked blog by user 
router.get('/liked-blogs', requireSignIn, getLikedArticles);

router.get('/blog-photo-direct/:id', getOgImage);


export default router;