import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const UserSchema = new Schema(
    {
        name: {
            type: "String",
            required: true,
            index: true
        },
        email: {
            type: "String",
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: "String",
            required: true,
        },
        role: {
            type: "String",
            required: true,
        },
        refreshToken:{
            type:"String",
        }
    }
)

//Password Encryption..
UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password =await bcrypt.hash(this.password, 10);
    next();
});


UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id:this._id,
            email:this.email,
            name:this.name
        }, process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
UserSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {
            _id:this._id,
           
        }, process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User", UserSchema);