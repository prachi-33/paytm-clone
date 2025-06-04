const dotenv = require("dotenv");
dotenv.config();
const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Database Connected"))
.catch((err)=>console.log(err))

const userSchema= new mongoose.Schema({
    userName:{type:String,trim:true,required:true,minlength:3},
    firstName:{type:String,trim:true,required:true},
    lastName:{type:String,trim:true,required:true},
    password:{type:String,trim:true,required:true}
})
const accountSchema= new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    balance:{type:Number,required:true}
})

const User=mongoose.model("User",userSchema);
const Account=mongoose.model("Account",accountSchema);
module.exports={User,Account};