import mongoose, {Schema} from "mongoose";

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
            required:true,
        }, // "to-do", "in-progress", "deployed" ,"Completed"
        priority: {
            type:"String",
            required:true,
            default:"low",
        }, // "low", "medium", "high"
        category:{
            type:"String",
            lowercase:true,
            required:true,
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

export const Item = mongoose.model("Item",itemSchema);