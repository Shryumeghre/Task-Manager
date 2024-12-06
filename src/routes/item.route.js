import {Router} from 'express';
import {upload} from "../middleware/multer.middleware.js";
import {verifyJWT} from "../middleware/auth.middleware.js";


const itemRouter = Router();
itemRouter.use(verifyJWT);



import {createItem,updateItem,getAllItems,getItemByAssignedTo} from "../controller/item.controller.js";


itemRouter.post("/create",
    upload.single("image"),
    createItem
);

itemRouter.post("/update", 
    updateItem
)

itemRouter.get("/get-all-items",
    getAllItems
);

itemRouter.get("/get-item-by-assignedto",
    getItemByAssignedTo
);

export { itemRouter };