import mongoose from 'mongoose'; ``
import colors from 'colors';

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Connect to the MongoDB using the MONGO_URL from the environment variables
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to the database".bgMagenta);

    } catch (error) {

        console.error(`Error connecting to the database: ${error.message}`.bgRed);
    }
};

export default connectDB;