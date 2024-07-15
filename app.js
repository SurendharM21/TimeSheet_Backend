const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require("path")
const cors = require("cors")
const errorMiddleware = require("./middlewares/error")

dotenv.config({path: path.join(__dirname,"./config/config.env")})

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongodb connected")
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(
    cors({
      origin:"*",
    })
  );
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Headers', '*');
  
    next();
  });
const userRoute = require("./routes/userRoute")
app.use("/api/v1/users",userRoute)
app.use(errorMiddleware)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
module.exports= app