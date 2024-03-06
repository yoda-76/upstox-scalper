const express = require("express");
const app = express();
const http = require("http"); // Add the http module
const server = http.createServer(app); // Create an HTTP server
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {userVerification}=require("./Middlewares/AuthMiddleware")
const authRoute = require("./Routes/AuthRoute");
const profile = require("./Routes/profile");
const tradingConsole = require("./Routes/tradingConsole");
require("dotenv").config();

const {  PORT } = process.env ||3000; 

  app.use(express.json());
 


app.get("/", (req,res)=>{
    console.log(typeof req.headers["access-token"])
    console.log(req.headers["access-token"])

})


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});