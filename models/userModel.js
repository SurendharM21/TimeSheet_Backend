const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
    },
    userEmail:{
        type: String,
        required: true,
        unique: true
    },
    userPassword:{
        type:String,
        Selection: false
    },
    imagePath:{
        type: String
    }
    
})



userSchema.methods.createToken = function(){
    
 return jwt.sign({id:this.id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES})
}



module.exports = mongoose.model("user",userSchema)