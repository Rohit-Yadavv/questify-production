import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        lowecase: true,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'category',
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },

    content: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
