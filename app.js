import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./db/connection.js";
import userRouter from "./routes/user.route.js";
import todoRouter from "./routes/todo.route.js"
import { isAuthenticate } from "./middleware/isAuthenticate.js";
dotenv.config();
const app = express();

// required middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // your React app's URL
    credentials: true
  }))
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// db connection
connection();

// routes
app.use("/api/user", userRouter);
app.use("/api/todo", isAuthenticate, todoRouter);

// Start server
app.listen(PORT,()=>{
    console.log(`Server started at post ${PORT}`);
});