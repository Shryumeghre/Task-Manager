import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiErrors.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import { Item } from '../model/Item.model.js';
import {User} from "../model/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
//create item
const createItem = asyncHandler(async (req,res) =>{
    //get the data from user.
    const {title,description,status,priority,category,assignedTo,deadline} = req?.body;
    const user = req?.user;

    //validate data -> not validate then throw error.
    if([title,priority,assignedTo,category].some((field) => field?.trim() === "")){
        throw new ApiError(400,"Insufficient Data");
    }
    //check for images
    const imageLocalpath = req.file?.path;

    //if(image)->handle
    if(image){
       const uploadedImg =  await uploadOnCloudinary(imageLocalpath);
    }
    //Find user whom to assign
    const assignedToUser = await User.findOne({
        email:assignedTo
    });

    if(!assignedToUser){
        throw new ApiError(404,"No user of this email.");
    }

    //not image
    if(category.trim().toLowercase()==="task"){
        if(user.role?.trim().toLowercase()!="manager")
        {
            throw new ApiError(403,"only managers can assign task.");
        }
    }
    const assignedToUserId = assignedToUser?._id;
    
    //create mongodb object , save
    const item = await Item.create(
        {
            title,
            description,
            status,
            priority,
            image:uploadOnCloudinary,
            category,
            assignedTo:assignedToUserId,
            assignedBy:user._id,
            deadline

        }
    );
    if(!item){
        throw new ApiError(500,"Internal Server Error");
    }
    //return response.
    return res.status(200).json(
        new ApiResponse(
            200,
            item,
            "Item created Succesfully",
        )
    )
});

//update item


//move to  "in-progress", "deployed" ,"Completed". - authorization for developer


//move to "to-do" dev,tester


//get all items



//get item by assigned to  name



//get item by assigned by name



//get item by category







export {createItem};
