//https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=b643879d-2584-48ef-81c4-29fe850e4ded&redirect_uri=http://localhost:4000/auth&state=test14@gmail.com
//https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=b643879d-2584-48ef-81c4-29fe850e4ded&redirect_uri=http%3A%2F%2Flocalhost:4000%2Fauth&state=test10@gmail.com
 


 
const User = require("../Models/UserModel");
const axios=require("axios")


module.exports.GetAccessToken = async (email,authcode) => {
  var currentdate = new Date(); 
  console.log(email,authcode)
  const user = await User.findOne({ email });
  console.log(user)
  if(!user){
  return 
  }
  console.log("first log :\n",user)
  const response=await axios.post('https://api.upstox.com/v2/login/authorization/token', new URLSearchParams({
    code: authcode,
    client_id: user.key,
    client_secret: user.secret,
    redirect_uri: 'http://localhost:4000/auth',
    grant_type: 'authorization_code',
}), {
      headers: {
          'Accept': 'application/json',
          'Api-Version': '2.0',
          'Content-Type': 'application/x-www-form-urlencoded',
      }
  })
  console.log("Data: ",response.data);
  const resp=await User.findOneAndUpdate({ email }, { $set: { 
    data:response.data,
    lastTokenGeneratedAt:currentdate.toLocaleString()
  } });
  if (resp) { 
    console.log("Original Doc: ", resp);
    return resp
  } else {
    throw new ApiError(500,"erroe autherizing with upstok", ".Controllers/Autherization: GetAccessToken")
    
  }
};

























// module.exports.GetAccessToken = async (req, res, next) => {
//     try {
//       const { key, secret, email} = req.body;
      
//       //add access token to the database
  
//       passport.use(new OAuth2Strategy({
//           authorizationURL: `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${key}&redirect_uri=http://localhost:4000/auth`,
          
//           clientID: key,
//           clientSecret: secret,
//           tokenURL: `https://api.upstox.com/v2/login/authorization/token`,
//           callbackURL: "http://localhost:4000/auth"
//         },
//         function(accessToken, refreshToken, profile, cb) {
//           console.log("Access Token => ", accessToken)
//         }
//       ));
      
//       res
//         .status(201)
//         .json({ message: "Autherised successfully", success: true });
//       next();
//     } catch (error) {
//       console.log("error =>>",error);
//     }
//   };
  