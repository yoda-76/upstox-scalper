const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const protobuf = require("protobufjs");
const UpstoxClient = require("upstox-js-sdk");

const app = express();
const server = http.createServer(app);

// Use express-ws to add WebSocket support to the existing Express server
require("express-ws")(app, server);

const { MONGO_URL, PORT } = process.env;

// ... (other imports and configurations)
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Read instrument keys data from file
const jsonFilePath2 = path.join(__dirname, "token_data", "instrument_keys_data.json");
let keysData;

fs.readFile(jsonFilePath2, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  // Parse the JSON data
  try {
    const jsonData = JSON.parse(data);
    keysData = jsonData;
    console.log("JSON data:", jsonData);
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
  }
});

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
const connectWebSocket = async (wsUrl, ws) => {
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
      ws.send(JSON.stringify(data));
    }, 1000);
  });

  ws.on("close", () => {
    console.log("disconnected");
  });

  ws.on("message", (data) => {
    // Decode the protobuf message
    const decodedData = decodeProtobuf(Buffer.from(data, "binary"));

    // Broadcast the data to all connected clients
    app.getWss().clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(decodedData));
      }
    });
  });

  ws.on("error", (error) => {
    console.log("error:", error);
  });
})
}

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
  

// Express route to handle WebSocket connections
app.ws("/market-feed", async (ws, req) => {
  try {
    await initProtobuf(); // Initialize protobuf
    const wsUrl = await getMarketFeedUrl(); // Get the market feed URL
    await connectWebSocket(wsUrl, ws); // Connect to the WebSocket
  } catch (error) {
    console.error("An error occurred:", error);
    ws.close();
  }
});

// Start the combined HTTP and WebSocket server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
