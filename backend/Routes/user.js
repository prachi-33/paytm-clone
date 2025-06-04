const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { User, Account } = require("../db");
require("dotenv").config();

const signupSchema = zod.object({
    userName: zod.string().min(3),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});



router.post("/signup", async (req, res) => {
    const body = req.body;
    const result = signupSchema.safeParse(body);

    if (!result.success) {
        return res.status(400).json({ msg: "Incorrect inputs" });
    }

    const existingUser = await User.findOne({ userName: body.userName });
    if (existingUser) {
        return res.status(409).json({ msg: "User already exists" });
    }

    try {
        const hashed = await bcrypt.hash(body.password, 2);
        const dbUser = await User.create({
            userName: body.userName,
            firstName: body.firstName,
            lastName: body.lastName,
            password: hashed
        });

        const userId = dbUser._id;

        await Account.create({
            userId: userId,
            balance: 1 + Math.random() * 10000
        });

        const token = jwt.sign({ userId }, process.env.JWT_SECRET);

        res.status(201).json({
            msg: "User created successfully",
            token: token
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

const signinSchema = zod.object({
    userName: zod.string().min(3),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    const result = signinSchema.safeParse(body);

    if (!result.success) {
        return res.status(400).json({ msg: "Invalid inputs" });
    }

    const user = await User.findOne({ userName: body.userName });
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
        msg: "Signin successful",
        token: token
    });
});

const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.put("/", authMiddleware, async (req, res) => {
    const result = updateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({ message: "Invalid inputs" });
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({ message: "Updated successfully" });
});


router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            {
                firstName: { $regex: filter, $options: "i" }
            },
            {
                lastName: { $regex: filter, $options: "i" }
            }
        ]
    });

    res.json({
        user: users.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = router;
