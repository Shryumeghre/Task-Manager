import { v2 as cloudinary} from "cloudinary";
import fs from 'fs';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async(localFilePath)=>{
    try{
        if(!localFilePath) return null;
        else{
            const response = await cloudinary.uploader.upload(localFilePath);
            console.log("File has been uploaded on cloudinary : ",response.url);
            if(localFilePath)
                fs.unlinkSync(localFilePath);
            return response;
        }

    }catch(error){
        console.log("--------",error)
        if(localFilePath)
            fs.unlinkSync(localFilePath);//remove the locally saved temporary file.
        return null;
    }
}

const deleteFromCloudinary= async(cloudFilePublicId)=>{
    try {
        const response =cloudinary.api
            .delete_resources([cloudFilePublicId], 
            { type: 'upload', resource_type: 'image' });


        // console.log(success)
        return response;
    } catch (error) {
        console.log("Deletion from url failed",error)
        return null;
    }
}
export {uploadOnCloudinary,deleteFromCloudinary};

