import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import app  from "./app.js";

dotenv.config({
  path: "./.env",
});
console.log(process.env.MONGODB_URI);
connectDB()
.then(
    ()=>{
        app.on("error", (error) => {
            console.log(error);
            throw error;
        });
        app.listen(process.env.PORT || 8000);
        console.log(`Server is running on port : ${process.env.PORT}`);
    }
)
.catch((err) => {
    console.log(`MongoDB connection Failed.: ${err}`);
});



