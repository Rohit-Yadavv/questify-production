import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import Liked from "../models/likeModel.js";
import slugify from "slugify";
import fs from 'fs';
import axios from 'axios';
// Create a new blog
export const createBlogController = async (req, res) => {

    try {
        const { title, description, category, content } = req.fields;
        const { photo } = req.files;

        if (!title || !description || !content || !category) {
            return res.status(400).json({ error: 'Title, description, category,content are required' });
        }

        const blog = new Blog({ ...req.fields, slug: slugify(title) });

        if (photo) {
            blog.photo.data = fs.readFileSync(photo.path);
            blog.photo.contentType = photo.type;
        }

        await blog.save();

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error in creating Blog',
        });
    }
};


// Update an existing blog
export const updateBlogController = async (req, res) => {
    try {
        const { title, description, category, content } = req.fields;
        const { photo } = req.files;

        if (!title || !description || !category || !content) {
            return res.status(400).send({ error: "All Fields are required" });
        }

        if (photo && photo.size > 1000000) {
            return res.status(400).send({ error: "Photo is required and should be less than 1mb" });
        }

        const updates = { ...req.fields, slug: slugify(title) };

        if (photo) {
            updates.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type,
            };
        }

        const blog = await Blog.findByIdAndUpdate(req.params.bid, updates, { new: true });

        res.status(200).send({
            success: true,
            message: "Blog Updated Successfully",
            blog,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in updating Blog",
        });
    }
};

// Get all blogs
export const getAllBlogsController = async (req, res) => {
    try {
        const blogs = await Blog
            .find({})
            .select("-photo")
            .populate("category")
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            TotalCount: blogs.length,
            message: "All blogs",
            blogs,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting blogs",
        });
    }
};

// Get a single blog by slug
export const getSingleBlogController = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");
        const totalLikes = await Liked.countDocuments({ blogs: blog._id });

        res.status(200).send({
            success: true,
            blog,
            totalLikes
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting blog",
        });
    }
};


// similar products
export const getRelatedBlogsController = async (req, res) => {
    try {
        console.log("first")
        const { pid, cid } = req.params;
        const blogs = await Blog
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .populate("category");
        res.status(200).send({
            success: true,
            blogs,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error while geting related blogs",
            error,
        });
    }
};

// Delete a blog
export const deleteBlogController = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.bid).select("-photo")

        res.status(200).send({
            success: true,
            message: "Blog Deleted Successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while deleting",
            error,
        });
    }
};

// latest blog get
export const getLatestBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).select("-photo").populate("category").limit(10).sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            message: "latest Blogs",
            blogs,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while geting latest blogs",
            error,
        });
    }
};


export const likeBlogController = async (req, res) => {
    try {
        const blogId = req.params.bid;
        const userId = req.user._id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        const like = await Liked.findOne({ blogs: blogId, user: userId });

        if (like) {
            // User has already liked the post, remove the like
            await like.delete();
        } else {
            // User has not liked the post, add the like
            await Liked.create({ blogs: blogId, user: userId });
        }

        // Get the total likes count for the blog
        const totalLikes = await Liked.countDocuments({ blogs: blogId });

        res.status(200).json({ liked: !like, likes: totalLikes });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// checkBlogLiked
export const checkBlogLiked = async (req, res) => {
    try {
        const blogId = req.params.bid;
        const userId = req.user._id;

        const like = await Liked.findOne({ blogs: blogId, user: userId });

        if (like) {
            res.json({ liked: true });
        } else {
            res.json({ liked: false });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};



// Get liked articles for the authenticated user
export const getLikedArticles = async (req, res) => {
    try {
        const userId = req.user._id;
        const likedArticles = await Liked.find({ user: userId }).populate("blogs");
        res.json(likedArticles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getBlogPhotoController = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.pid).select('photo');
        if (!blog || !blog.photo || !blog.photo.data) {
            return res.status(404).send('Image not found');
        }
        res.set('Content-type', blog.photo.contentType);
        return res.status(200).send(blog.photo.data);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while getting photo',
            error,
        });
    }

};
export const getOgImage = async (req, res) => {
    try {
        // Fetch the image data from your API
        const response = await axios.get(`https://www.questify.site/api/v1/blog/blog-photo/${req.params.id}`, {
            responseType: 'stream', // Set the response type to stream to directly pipe the image
        });
        const imageContentType = response.headers['content-type'];
        res.set('Content-Type', imageContentType);

        // Pipe the image data to the response
        response.data.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching image');
    }
}