const mongoose=require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Database Connected"))
.catch((err)=>console.log(err))

const userSchema= new mongoose.Schema({
    userName:String,
    firstName:String,
    lastName:String,
    password:String
})

const User=mongoose.model("User",userSchema);
module.exports=User;