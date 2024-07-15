
const sendToken = (user, statusCode, res) => {

    const token = user.createToken();

   
    const options = {
        expires: new Date(
                Date.now() +  30 * 60 * 1000 
            ),
        httpOnly: true,
    }

    res.status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        token,
        user
    })


}

module.exports = sendToken;