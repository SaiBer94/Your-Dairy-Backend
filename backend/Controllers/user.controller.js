const jwt = require("jsonwebtoken") 

const User = require("../Models/user.model")
const createAccount =  async(req, res) => {
    const {fullName, email, password} = req.body;

    if(!fullName) {  return res.status(400).json({error:true, message:"Full name is required"})  }
    if(!email) {return res.status(400).json({error:true, message:"Email is required"}) }
    if(!password) {return res.status(400).json({error:true, message:"Password is required"}) }

    //const isUser = await User.findOne({email: email});
    const user = new User({
        fullName, email, password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"3600m",
    })

    return res.status(200).json({
        error:false, user,accessToken, message:"Registration completed",
    })

}

module.exports = {createAccount}