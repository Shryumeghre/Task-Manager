import {Router} from 'express';
import {verifyJWT} from "../middleware/auth.middleware.js";


//initiating route
const userRouter = Router();



//Importing the controllers
import {
    createUser,
    loginUser,
    getAllUser
    } from "../controller/user.controller.js";




//Defining Routes
userRouter.post("/register",
    createUser
);
userRouter.post("/login",
    loginUser
);
userRouter.get("/getalluser",
    verifyJWT,
    getAllUser
);

export { userRouter };

