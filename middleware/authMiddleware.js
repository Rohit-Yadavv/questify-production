import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Middleware to protect routes using JSON Web Token (JWT)
export const requireSignIn = async (req, res, next) => {
    try {
        // console.log(req.headers)
        // Verify the token from the 'Authorization' header using the JWT_SECRET
        const decodedToken = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);

        // Set the decoded user data to the request object for further use
        req.user = decodedToken;
        // console.log(req.user)

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        // If the token is invalid or expired, return an unauthorized error
        res.status(401).send({
            success: false,
            error,
            message: "Error in requireSignIn middleware",
        });
    }
};

// Middleware to check if the user is an admin
export const isAdmin = async (req, res, next) => {
    try {

        const user = await userModel.findById(req.user._id);

        // Check if the user's role is 'admin', if yes, move to the next middleware or route handler
        if (user.role === "admin") {
            next();
        } else {
            // If the user is not an admin, return an unauthorized access message
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access: Admin access required.",
            });
        }
    } catch (error) {
        // If an error occurs during the process, return an unauthorized error
        res.status(401).send({
            success: false,
            error,
            message: "Error in isAdmin middleware",
        });
    }
};
