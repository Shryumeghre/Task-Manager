import {Router} from 'express';
import {upload} from "../middleware/multer.middleware.js";
const itemRouter = Router();

import {createItem} from "../controller/item.controller.js";


itemRouter.post("/create",
    upload.single("image"),
    createItem
);


export { itemRouter };