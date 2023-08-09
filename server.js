import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import connectDB from './config/db.js';
import colors from 'colors';
import authrouter from './routes/authRoutes.js';
import blogrouter from './routes/blogroutes.js';
import categoryrouter from './routes/categoryRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import connectRouter from './routes/connectRoutes.js';
import cors from 'cors';

// for deployment

import path from 'path';
import { fileURLToPath } from 'url';


// Load environment variables from .env file
dotenv.config();




// es6 fix we can't use __dirname in es6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Create the Express app
const app = express();


// for deployment
app.use(express.static(path.join(__dirname, "./frontend/build")));




// Middlewares
// Log HTTP requests in development mode
app.use(morgan('dev'));
// Parse incoming JSON data in the request body
app.use(express.json());
// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());



// Routes
// Routes for authentication
app.use('/api/v1/auth', authrouter);
// Routes for blogs
app.use('/api/v1/blog', blogrouter);
// Routes for categories
app.use('/api/v1/category', categoryrouter);
// Routes for contact
app.use('/api/v1/contact', contactRouter);
// Routes for connection
app.use('/api/v1/connect', connectRouter);

// rest api deployment
app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./frontend/build/index.html"))
})


// Running the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running at ${PORT}`);
// });

const PORT = process.env.PORT || 5000;
//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})



// import dotenv from 'dotenv';
// import express from 'express';
// import morgan from 'morgan';
// import connectDB from './config/db.js';
// import colors from 'colors';
// import authrouter from './routes/authRoutes.js';
// import blogrouter from './routes/blogroutes.js';
// import categoryrouter from './routes/categoryRoutes.js';
// import contactRouter from './routes/contactRoutes.js';
// import connectRouter from './routes/connectRoutes.js';
// import cors from 'cors';

// // Load environment variables from .env file
// dotenv.config();

// // Create the Express app
// const app = express();

// // Middlewares
// // Log HTTP requests in development mode
// app.use(morgan('dev'));
// // Parse incoming JSON data in the request body
// app.use(express.json());
// // Enable Cross-Origin Resource Sharing (CORS) for all routes
// app.use(cors());


// // Routes
// // Routes for authentication
// app.use('/api/v1/auth', authrouter);
// // Routes for blogs
// app.use('/api/v1/blog', blogrouter);
// // Routes for categories
// app.use('/api/v1/category', categoryrouter);
// // Routes for contact
// app.use('/api/v1/contact', contactRouter);
// // Routes for connection
// app.use('/api/v1/connect', connectRouter);


// const PORT = process.env.PORT || 5000;
// //Connect to the database before listening
// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log("listening for requests");
//     })
// })
