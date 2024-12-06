import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
// explore functionalities of cors
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));//use method is used to implement middlewares.

//Type of data we are accepting...
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

//setting up cookies in user browser 
app.use(cookieParser())

//import routes
import {itemRouter} from "./routes/item.route.js";
import { userRouter } from './routes/user.route.js';

//used routes
app.use("/item",itemRouter);
app.use("/user", userRouter);

export default app;