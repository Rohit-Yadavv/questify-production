import JWT from "jsonwebtoken";
import { hashPassword, comparePassword } from "../helpers/authHelpers.js";
import userModel from "../models/userModel.js";

// Register a new user
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, answer } = req.body;

        if (!name || !email || !password || !phone || !answer) {
            return res.status(400).send({ success: false, message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Already Registered. Please Login"
            });
        }

        // Hash the password and create a new user
        const hashedPassword = await hashPassword(password);
        const newUser = await userModel({ name, email, password: hashedPassword, phone, answer }).save();

        const { _id, name: userName, email: userEmail } = newUser;

        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user: { _id, name: userName, email: userEmail },
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
}

// Login user
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({
            sucess: false,
            message: "All fields are required"
        });

        const user = await userModel.findOne({ email });

        // Compare the entered password with the stored hashed password
        const match = await comparePassword(password, user.password);

        if (!user || !match) return res.status(404).send({
            sucess: false,
            message: "Invalid Credentials"
        });

        // Generate a JWT token for the authenticated user
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d', });

        // Send the login success response with the user data and token
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                answer: user.answer,
                role: user.role
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
}

// Forget Password
export const forgetPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        if (!email || !answer || !newPassword) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        // Find the user by email and answer
        const user = await userModel.findOne({ email, answer });

        if (!user) {
            return res.status(404).send({ success: false, message: 'Incorrect email or answer' });
        }

        // Hash the new password and update the user's password
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
}


//update prfole
export const updateProfileController = async (req, res) => {
    try {
        const { name, password, answer, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        // if (password && password.length < 6) {
        //     return res.json({ error: "Passsword is required and 6 character long" });
        // }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {

                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                answer: answer || user.answer,
            },
            { new: true }
            // { new: true } will return the modified document rather than the original.
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};




// Test protected route
export const testController = async (req, res) => {
    res.send("protected routes");
}