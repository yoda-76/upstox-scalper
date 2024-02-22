const { Signup, Login, changePassword, saveKeyAndSecret } = require('../Controllers/AuthController')
// const {  } = require('../Controllers/saveKeyAndSecret');
// const { userVerification } = require('../Middlewares/AuthMiddleware');
const router = require('express').Router();

// router.post('/', userVerification);
router.post('/signup', async(req,res,next)=>{
  const {email, password, username, createdAt}=req.body
  // console.log("first")

  try{
    const token=await Signup(email, password, username, createdAt)
    if(token){
      // console.log(token)
      res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signup successfully" });
    }else{
      res.json({ message: "User already exists" })
    }
  }catch(err){
      console.log(err)
      res.status(500).send("Internal server error")
  }
})
//change these routes too
router.post('/login', async(req,res,next)=>{
  const {email, password}=req.body
  console.log("first")
  try{
    const {token,data}=await Login(email, password)
    console.log(data)
    if(token){
      console.log(token)
      res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      path: '/'
    });
    res
      .status(200)
      .json({success:"ok", message: "User login successfully",token, data });
    }else{
      return res.status(500).json({message:'Incorrect password or email' })
    }
  }catch(err){
      console.log(err)
      res.status(err.status_code || 500).json({
        success: false,
        err
      });  }
})


router.post("/saveKeyAndSecret", async(req,res,next)=>{
  const {key, secret}=req.body
  try{
    const user =req.user
    const resp=await saveKeyAndSecret(user, key, secret)
    if(resp){
      console.log(user)
    res
      .status(201)
      .json({ message: "changed" });
    }else{
      res.json({ message: "not changed" })
    }
  }catch(err){
      console.log(err)
      res.status(500).send("Internal server error")
  }
});
router.post('/change-password', changePassword)

module.exports = router;
