const express=require("express");
require("dotenv").config();
const app=express();
const mainRouter=require("./Routes/index")
const PORT=process.env.PORT || 3000;
app.use(express.json());
app.use('/api/v1',mainRouter);
app.lister(PORT,(err)=>{
    err? console.log(err):console.log(`Server Running at Port ${PORT}`)

})
