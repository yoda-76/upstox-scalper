const { GetAccessToken } = require('../Controllers/Autherisation')
const { userVerification}=require('../Middlewares/AuthMiddleware')
const router = require('express').Router()

// router.post('/',userVerification)

router.get("/auth", async(req, res) => {
  const authcode=req.query.code;
  const email=req.query.state
  console.log(email)
    const user=await GetAccessToken(email,authcode)
    if(user){
      console.log("data added")
      res.status(201).json({
      message: "Access token saved successfully",
      success: true,
    });}
  })
module.exports = router
