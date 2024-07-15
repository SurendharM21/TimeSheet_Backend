const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const User = require("../models/userModel")
const errorhandler = require("../utils/errorhandler")
const otplib = require("otplib")
const sendMail = require("../utils/jwt")


exports.userSignup = async(req,res,next)=>{

    const {userName,userEmail,userPassword} = req.body
    
    const imagePath = req.file.path

  
    console.log(req.body)
    const hashedUserPassword = await bcrypt.hash(userPassword,10)

    const newUser = await User.create({
        userName: userName,
        userEmail: userEmail,
        userPassword: hashedUserPassword,
        imagePath: imagePath
    })

    if(!newUser)
        {
            return next(new errorhandler("User Cannot be Registered",401))
        }

    sendMail(newUser,201,res)
}

exports.userSignin = async(req,res,next)=>{

    const {userEmail} = req.body
    console.log(req.body)
    const mailto = await User.findOne({userEmail: userEmail})
    if(!mailto){
        return next(new errorhandler("No User Found",401))
    }

   const secret = process.env.OTPLIB_SECRET
   
   otplib.authenticator.options={digits: 4, step:60}
   const otp = otplib.authenticator.generate(secret)

   const generatedOtp = await User.findOneAndUpdate({userEmail:userEmail},{otp: otp})

      let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.GMAILUSERNAME,
        pass: process.env.GMAILAPPPASSWORD
    }
   })
   const mailOptions = {
    from: process.env.GMAILUSERNAME,
    to: 'msdsuren07@gmail.com',
    subject: 'Otp For Signin',
    html:`<p> The Otp for your login is ${otp}</p>`
   }
  
//    const mail =await transporter.sendMail(mailOptions)
   res.json({
    success: true,
    message: "The Otp Is Sent",
    otp
   })
}

exports.verifyOtp = async(req,res,next)=>{
    const {otp,userEmail} = req.body
    console.log(otp)
    const secret = process.env.OTPLIB_SECRET

    const verified =  otplib.authenticator.check(otp,secret)
    console.log(verified)
    if(!verified)
        {
            return next(new errorhandler("Otp is Worong",401))
        }
    const user = await User.findOne({userEmail: userEmail})
    res.json({                
        success: true,
        message: "Otp Verified",
        user

    })
}

exports.sendMail = async(req,res)=>{


        let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.GMAILUSERNAME,
        pass: process.env.GMAILAPPPASSWORD
    }
   })
   const mailOptions = {
    from: process.env.GMAILUSERNAME,
    to: 'msdsuren07@gmail.com',
    subject: 'Otp For Signin',
    attachments:[
        {
          filename: "timsheet.xlsx",
          path: req.file.path
        }
    ]
   }

//    const mail = await transporter.sendMail(mailOptions)
   res.json({
    success: true,
    message:"Mail sent successfully"
   })
}
