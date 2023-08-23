import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';


dotenv.config();
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

// import mongoose from 'mongoose';
// import colors from 'colors';
// import retry from 'retry';

// // Function to connect to the MongoDB database
// const connectDB = async () => {
//     const retryOptions = {
//         retries: 5,              // Number of retry attempts
//         factor: 2,               // Exponential back-off factor (2 means double the delay each time)
//         minTimeout: 1000,        // Minimum delay before retrying (in milliseconds)
//         maxTimeout: 60000,       // Maximum delay before retrying (in milliseconds)
//         randomize: true          // Randomize the delays between retries to avoid synchronization
//     };

//     const retryOperation = retry.operation(retryOptions);

//     retryOperation.attempt(async (currentAttempt) => {
//         try {
//             // Connect to the MongoDB using the MONGO_URL from the environment variables
//             const conn = await mongoose.connect(process.env.MONGO_URL);
//             console.log("Connected to the database".bgMagenta);
//         } catch (error) {
//             console.error(`Error connecting to the database: ${error.message}`.bgRed);
//             if (retryOperation.retry(error)) {
//                 return;
//             }
//         }
//     });
// };

// export default connectDB;
