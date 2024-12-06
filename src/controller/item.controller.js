import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiErrors.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import { Item } from '../model/Item.model.js';
import {User} from "../model/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import  {roles, categories, statuses, priorities} from "../constants.js";
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
    if(imageLocalpath){
       var uploadedImg =  await uploadOnCloudinary(imageLocalpath);
    }
    //Find user whom to assign
    const assignedToUser = await User.findOne({
        email:assignedTo
    });

    if(!assignedToUser){
        throw new ApiError(404,"No user of this email.");
    }

    if(category.trim().toLowerCase()==="task"){
        if(user.role?.trim().toLowerCase()!="manager")
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
            image:uploadedImg,
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
const updateItem = asyncHandler(async (req, res) =>{
    const {itemId, description, status, priority, assignedToUser, deadline} = req.body;

    const item =await Item.findById(itemId);
    //validation
    if(status ){
        if(!statuses.includes(status)){
            throw new ApiError(400,"Invalid status");
        }
        item.status = status;
    }

    if(priority ){
        if(!priorities.includes(priority)){
            throw new ApiError(400,"Invalid priority");
        }
        item.priority = priority;
    }
    
    if(description){
        item.description = description;
    }

    if (deadline) {
        const deadlineDate = new Date(deadline); 
        if (deadlineDate < Date.now()) { 
          throw new ApiError(400, "Invalid deadline");
        }
        item.deadline = deadlineDate;
    }
      
    if(assignedToUser){
        const assignedTo = await User.findOne({email:assignedToUser});

        console.log(assignedTo);
        if(!assignedTo){
            throw new ApiError(404,"User not found");
        }

        item.assignedTo=assignedTo._id;
    }


    const updatedItem = await item.save({validateBeforeSave:true});
    if(!updatedItem){
        throw new ApiError(500,"Error in updating the item");
    }


    res.status(200).json(
        new ApiResponse(
            200,
            updatedItem,
            "Item updated Succesfully"
        )
    )
})

//get all items
const getAllItems = asyncHandler(async(req, res)=> {
    const {page=1,category, limit=30, sortBy, sortType='desc'} = req.query;
    const skip = (page-1)*limit;
    const sortOption = { [sortBy]: sortType === 'asc' ? 1 : -1};
    let allItems ;
    if(!category){
        allItems = await Item.find().sort(sortOption).skip(skip).limit(parseInt(limit));
    }else{
        allItems = await Item.find({category}).sort(sortOption).skip(skip).limit(parseInt(limit));
    }
    

    if(!allItems){
        throw new ApiError(500,"Items not available");
    }

    res.status(200)
    .json(
        new ApiResponse(200,
            allItems,
            "Items retrieved successfully"
        )
    );
})

//get item by assigned to  name
const getItemByAssignedTo = asyncHandler(async(req, res)=> {
    const {assignedTo,page=1, limit=30, sortBy, sortType='desc'} = req.query;
    const skip = (page-1)*limit;
    const sortOption = { [sortBy]: sortType === 'asc' ? 1 : -1};

    const user = await User.findOne({email:assignedTo});
    if(!user){
        throw new ApiError(404,"User Not Found");
    }

    const allItems = await Item.find({assignedTo:user._id}).sort(sortOption).skip(skip).limit(parseInt(limit));

    if(!allItems){
        throw new ApiError(500,"Items not available");
    }

    res.status(200)
    .json(
        new ApiResponse(200,
            allItems,
            "Items retrieved successfully"
        )
    );
})

//get item by assigned by name
const getItemByAssignedBy = asyncHandler(async(req, res)=> {
    const {assignedBy,page=1, limit=30, sortBy, sortType='desc'} = req.query;
    const skip = (page-1)*limit;
    const sortOption = { [sortBy]: sortType === 'asc' ? 1 : -1};

    const user = await User.findOne({email:assignedBy});
    if(!user){
        throw new ApiError(404,"User Not Found");
    }

    const allItems = await Item.find({assignedBy:user._id}).sort(sortOption).skip(skip).limit(parseInt(limit));

    if(!allItems){
        throw new ApiError(500,"Items not available");
    }

    res.status(200)
    .json(
        new ApiResponse(200,
            allItems,
            "Items retrieved successfully"
        )
    );
})







export {createItem,updateItem,getAllItems,getItemByAssignedTo};
