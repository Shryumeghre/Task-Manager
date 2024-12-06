import mongoose, {Schema} from "mongoose";
import { ApiError } from "../utils/ApiErrors.js";

const itemSchema = new Schema(
    {
        title: {
            type:"String",
            required:true,
            index:true,
        },
        description: {
            type:"String",
        },
        image: {
            type:"String"
        }, // Image for reference to developer
        status: {
            type:"String",
            lowercase:"true",
            default:"to-do",
        }, // "to-do", "in-progress", "deployed" ,"completed"
        priority: {
            type:"String",
            default:"low",
        }, // "low", "medium", "high"
        category:{
            type:"String",
            lowercase:true,
            default:"bug",
        },//task , bug
        assignedTo: {
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:true
        }, // Reference to Developer
        assignedBy:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        }, // Reference to Tester or Manager
        deadline: {
            type:"Date",
        },
        completedOn:{
            type:"Date",
        },
      },
      {
        timestamps:true
      }
)

// Middleware to update `completedOn` if `status` is "completed"
itemSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "completed") {
      this.completedOn = new Date();
    }
    if (this.isModified("deadline") && this.deadline) {
        const deadlineDate = new Date(this.deadline); // Ensure it's a Date object
        if (deadlineDate < Date.now()) {
          return next(new ApiError("Invalid deadline: Deadline must be a future date."));
        }
    }
    next();
});

export const Item = mongoose.model("Item",itemSchema);