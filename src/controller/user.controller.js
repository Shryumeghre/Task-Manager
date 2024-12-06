import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiErrors.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../model/user.model.js';
import bcrypt from "bcrypt";
import {roles} from "../constants.js"


const generateAccessandRefreshToken = async (UserId)=>{
       try{
        const user = await User.findById(UserId);
        const AccessToken = await user.generateAccessToken();
        const RefreshToken = await user.generateRefreshToken();
        user.refreshToken = RefreshToken; 
        await user.save({validateBeforeSave:false});
        return {AccessToken,RefreshToken};
       }catch(error){
        throw new ApiError(400,"Error generating tokens",error);
       }
    }


const createUser = asyncHandler(async (req, res) => {
    const {name, email, password, role} = req?.body;
    const user = req?.user;


    //Validations
    if([name, email, password, role].some((field)=> field.trim() === "")){
        throw new ApiError(400, "Insufficient Data");
    }
    
    if(!roles.some((field)=>field.trim().toLowerCase() == role.trim().toLowerCase())){
        throw new ApiError(400, "Invalid Role")
    };

    const existingUser = await User.findOne({
        email
    });

    if(existingUser){
        throw new ApiError(400, "Email already exists"); 
    }

    const RegisteredUser = await User.create(
        {
            name,
            email,
            password,
            role: role.trim()
        },
    );
    if(!RegisteredUser){
        throw new ApiError(500, "Internal Server Error");
    }
    console.log(RegisteredUser._id);
    const {AccessToken,RefreshToken} = await generateAccessandRefreshToken(RegisteredUser._id);

    const userData = await User.findById(RegisteredUser._id).select(
        "-password -refreshToken"
    );
    return res.status(200)
    .cookie(AccessToken)
    .cookie(RefreshToken)
    .json(
        new ApiResponse(
            200,
            userData,
            "User created successfully",
        )
    )
});

//login

const loginUser = asyncHandler(async(req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new ApiError(401,"Insufficient Data");
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400, "Invalid Email or Password");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        throw new ApiError(400, "Invalid Email or Password");
    }
    const {AccessToken,RefreshToken} = await generateAccessandRefreshToken(user._id);
    const userData = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    return res.status(200)
    .cookie(AccessToken)
    .cookie(RefreshToken)
    .json(
        new ApiResponse(200,{userData,AccessToken},"Login Successfull")
    );
})


//getAllUsers
const getAllUser = asyncHandler(async(req,res)=>{

    const {name, email} = req.query;
    let users;
    if(!name && !email){
        users = await User.find().select("-refreshToken -password");
    }
    else{
        users = await User.find(
            {
                $or: [{name},{email}]
            }
        ).select("-refreshToken -password");
    }
    
    if(!users){
        throw new ApiErrors(404, "Users not found");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Users retrieved successfully",
        )
    )
})



export {createUser,loginUser,getAllUser};