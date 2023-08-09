// liked.js (model)
import mongoose from "mongoose";

const likedSchema = new mongoose.Schema({
    blogs: {
        type: mongoose.ObjectId,
        ref: "Blog",
        required: true,
    },
    user: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Liked", likedSchema);
