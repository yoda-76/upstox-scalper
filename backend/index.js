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

// const { MONGO_URL, PORT } = process.env; 
const MONGO_URL="mongodb+srv://yadvendras20:tZW8src3FyjGmfRx@cluster0.mhj1s0l.mongodb.net/?retryWrites=true&w=majority"
const PORT=process.env.PORT || 8000

mongoose
.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));
  
  app.use(
  cors({
    origin: ["http://127.0.0.1:5174","http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


  app.use(cookieParser());
  app.use(express.json());
  app.use((req, res, next) => {
    if (req.path.startsWith('/test') || req.path.startsWith('/profile/login') || req.path.startsWith('/profile/signup') || req.path.startsWith('/auth')) {
      return next();
    }
    userVerification(req, res, next);
  });  

app.get("/test",(req,res)=>{
  res.send("ok")
})
app.get("/",(req,res)=>{
  res.send("ok")
})


app.use("/", authRoute);
app.use("/profile", profile);
app.use("/console", tradingConsole);


server.listen(PORT,'127.0.0.1', () => {
  console.log(`Server is listening on port ${PORT}`);
});

//.................................................................................

// const socketio = require('socket.io');
// const io = socketio(server, {
//   cors: {
//     origin: ["http://localhost:5173","http://127.0.0.1:5173"],  // Adjust the origin to match your React app's URL
//     methods: ["GET", "POST"],
//   },
// });
// const User = require("./Models/UserModel");
// // const { userVerification } = require("./Middlewares/AuthMiddleware");

// io.on('connection', async (socket) => {
  
// //.....................................................................................
//   console.log(`Socket ${socket.id} connected`);
//   const interval=setInterval(()=>{
//     console.log("hi")  
//     io.emit('message',"hi")
//   },1000)


//   socket.on('sendMessage', (message) => {
//     io.emit('message', message);
//   });
//   socket.on('message', (message) => {
//     console.log(message)
//     io.emit('message',message)
//   });
//   socket.on('disconnect', () => {
//     console.log(`Socket ${socket.id} disconnected`);
//     clearInterval(interval)
//   });
// });
//.................................................................................


const WebSocket = require("ws"); // Require the WebSocket library
const socketio = require('socket.io');
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:5173","http://127.0.0.1:5173"],  // Adjust the origin to match your React app's URL
    methods: ["GET", "POST"],
  },
});
const User = require("./Models/UserModel");
// const { userVerification } = require("./Middlewares/AuthMiddleware");

io.on('connection', async (socket) => {
  const user=await User.findOne({email:socket.handshake.query.email})
  console.log(user)
  const accessToken=user.data.access_token;
    // Import required modules
  const fs = require('fs');
  const path = require('path');
  const folderPath = path.join(__dirname, '../token_data');
  const jsonFilePath2 = path.join(folderPath, 'instrument_keys_data.json');
  const upstoxFeedDataPath = path.join(folderPath, 'upstoxFeed.json');
  let keysData;
  fs.readFile(jsonFilePath2, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return;
      }
    
      // Parse the JSON data
      try {
        const jsonData = JSON.parse(data);
        keysData=jsonData
        console.log('JSON data:', jsonData);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
      }
    });
  // console.log(keysData)
  var UpstoxClient = require("upstox-js-sdk");
  const WebSocket = require("ws").WebSocket;
  const protobuf = require("protobufjs");
  let protobufRoot = null;
  let defaultClient = UpstoxClient.ApiClient.instance;
  let apiVersion = "2.0";
  let OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = accessToken; // Replace "ACCESS_TOKEN" with your actual token

  // Function to authorize the market data feed
  const getMarketFeedUrl = async () => {
    return new Promise((resolve, reject) => {
      let apiInstance = new UpstoxClient.WebsocketApi(); // Create new Websocket API instance

      // Call the getMarketDataFeedAuthorize function from the API
      apiInstance.getMarketDataFeedAuthorize(
        apiVersion,
        (error, data, response) => {
          if (error) reject(error); // If there's an error, reject the promise
          else resolve(data.data.authorizedRedirectUri); // Else, resolve the promise with the authorized URL
        }
      );
    });
  };

  // Function to establish WebSocket connection
  const connectWebSocket = async (wsUrl) => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl, {
        headers: {
          "Api-Version": apiVersion,
          Authorization: "Bearer " + OAUTH2.accessToken,
        },
        followRedirects: true,
      });

      // WebSocket event handlers
      ws.on("open", () => {
        console.log("connected");
        resolve(ws); // Resolve the promise once connected

        // Set a timeout to send a subscription message after 1 second
        setTimeout(() => {
          const data = {
            guid: "someguid",
            method: "sub",
            data: {
              mode: "full",
              instrumentKeys: keysData,
            },
          };
          ws.send(Buffer.from(JSON.stringify(data)));

        }, 1000);
      });

      ws.on("close", () => {
        console.log("disconnected");
      });

      ws.on("message", (data) => {
        data=decodeProfobuf(data).feeds
        let updatedData={}

        for (const key in data){
            // NSE_FO and NSE_INDEX has different contents
            updatedData[key]=key.includes("NSE_FO")?data[key].ff.marketFF.eFeedDetails:data[key].ff.indexFF.ltpc
        }
        fs.writeFileSync(upstoxFeedDataPath,JSON.stringify(updatedData));
        io.emit('message',JSON.stringify(updatedData))
      });

      ws.on("error", (error) => {
        console.log("error:", error);
        reject(error); // Reject the promise on error
      });
    });
  };

  // Function to initialize the protobuf part
  const initProtobuf = async () => {
    protobufRoot = await protobuf.load(__dirname + "/MarketDataFeed.proto");
    console.log("Protobuf part initialization complete");
  };

  // Function to decode protobuf message
  const decodeProfobuf = (buffer) => {
    if (!protobufRoot) {
      console.warn("Protobuf part not initialized yet!");
      return null;
    }

    const FeedResponse = protobufRoot.lookupType(
      "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
    );
    return FeedResponse.decode(buffer);
  };

  // Initialize the protobuf part and establish the WebSocket connection
  (async () => {
    try {
      await initProtobuf(); // Initialize protobuf
      const wsUrl = await getMarketFeedUrl(); // Get the market feed URL
      const ws = await connectWebSocket(wsUrl); // Connect to the WebSocket
    } catch (error) {
      console.error("An error occurred:", error);
    }
  })();

//.....................................................................................
  console.log(`Socket ${socket.id} connected`);

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });
  socket.on('message', (message) => {
    console.log(message)
    io.emit('message',message)
  });
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});