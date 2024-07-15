const express = require("express")
const { userSignup, userSignin, verifyOtp, sendMail } = require("../controllers/userController")
const {profileUploader} = require("../middlewares/profileUpload")
const {timeSheet} = require("../middlewares/timeSheet")
const router = express.Router()

router.route("/signup").post(profileUploader,userSignup)
router.route("/signin").post(userSignin)
router.route("/verifyOtp").post(verifyOtp)
router.route("/sendReport").post(timeSheet,sendMail)

module.exports = router