const jwt = require("jsonwebtoken")
const errorhandler = require("../utils/errorhandler")
const user = require("../models/userModel")

exports.authenticateToken = async (req,res,next)=>{
const {token} = req.cookies
console.log("I the authenticated middeleware",token)
console.log(token)
if(!token)
{
    return next(new errorhandler("Login First to continue",401))
}
const verifys =  jwt.verify(token,process.env.JWT_SECRET)
if(!verifys)
    {
        return next(new errorhandler("un Authorized user",401))
    }
req.user = await user.findById(verifys.id)
next()
}