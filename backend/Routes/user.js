const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const authMiddleware=require("../middleware")
require("dotenv").config();
const jwt=require("jsonwebtoken");
const zod=require("zod");
import {User,Account} from "../db";

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
        res.status(400).json({
            msg:"Incorrect Inputs"
        })
    }
    const user=await User.findOne({userName: body.userName});
    if(user){
        res.status(409).json({
            msg:"User already exist"
        })
    }
    const dbUser=await User.create({
        userName:body.userName,
        firstName:body.firstName,
        lastName:body.lastName,
        password:bcrypt.hash(body.password,2)
    })
    .catch((err)=>console.log(err))
    const userId=dbUser._id;

    await Account.create({
        userId:userId,
        balance:1+Math.random()*10000
    })

    const token=jwt.sign(userId,process.env.JWT_SECRET);
    res.status(201).json({
        msg:"User created succesfully",
        token:token
    })


})
const signinSchema=zod.object({
    userName:zod.string().min(3),
    password:zod.string()
})

router.post("/signin",async (req,res)=>{
    const body=req.body;
    const success =signinSchema.safeParse(req.body)
    if(!success){
        res.status(400).json({
            msg:"Invalid inputs"
        })
    }
    

    const user=await User.findOne({userName:body.userName}) 
    
    const hashed=user.password;
    const isMatch=bcrypt.compare(req.password,hashed);
    isMatch? res.status(200).json({msg:"Signin successful"}): res.status(400).json({msg:"Wrong Password"})

    if(user){
        const token=jwt.sign(user._id,process.env.JWT_SECRET);
        res.status(200).json({
            token:token
        })
    }


})

const updateSchema=zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})
router.put("/update", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Invalid Inputs"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk",authMiddleware,async (req,res)=>{
    const filter =req.query.filter||"";
    const users= await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })

    res.json({
        user:users.map(user=>({
            userName:user.userName,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})


module.exports=router;