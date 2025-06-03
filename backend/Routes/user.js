const express=require("express");
const router=express.Router();
require("dotenv").config();
const jwt=require("jsonwebtoken");
const zod=require("zod");
import {User,Account} from "../db"
module.exports=router;

const signupSchema=zod.object({
    userName:zod.string().min(3),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()
    
})
router.post("/signup",async(req,res)=>{
    const body=req.body;
    const success=signupSchema.safeParse(body);
    if(!success){
        res.json({
            msg:"Incorrect Inputs"
        })
    }
    const user=await User.findOne({userName: body.userName});
    if(user){
        res.json({
            msg:"User already exist"
        })
    }
    const dbUser=await User.create({
        userName:body.userName,
        firstName:body.firstName,
        lastName:body.lastName,
        password:body.password
    })
    .catch((err)=>console.log(err))
    const userId=dbUser._id;

    await Account.create({
        userId:userId,
        balance:1+Math.random()*10000
    })

    const token=jwt.sign(userId,process.env.SECRET);
    res.json({
        msg:"User created succesfully",
        token:token
    })


})