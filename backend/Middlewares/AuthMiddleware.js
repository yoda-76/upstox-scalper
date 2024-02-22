const User = require("../Models/UserModel");
const ApiError  = require("../util/api_error.js")
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.
userVerification = (req, res, next) => {
  // const token = req.cookies.token
  const token = req.headers.token
  console.log("\n\n\n\n",token,"\n\n\n\n")
  if (!token) {
    return res.status(401).json({ status: "token missing from cookies" })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      throw new ApiError(401, "Unauthorized Request", "Middleware/AuthMiddleware: userVerification");
    } else {
      const user = await User.findById(data.id)
      if (user) {
        req.user=user
        console.log("verified\n\n")
        next()
      }
      else throw new ApiError(500, "couldn't fetch user", "Middleware/AuthMiddleware: userVerification");
    }
  })
}