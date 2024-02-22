const axios = require('axios');
const User = require("../Models/UserModel");
const ApiError=require("../util/api_error")




module.exports.getFunds = async (user) => {
  const accessToken=user.data.access_token
  console.log(user)

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.upstox.com/v2/user/get-funds-and-margin',
    headers: { 
      'Accept': 'application/json',
      'Api-Version': '2.0',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  const response=await axios(config)
  return response.data
};


module.exports.getPositions = async (user) => {
    const accessToken=user.data.access_token;
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.upstox.com/v2/portfolio/short-term-positions',
      headers: { 
        'Accept': 'application/json',
        'Api-Version': '2.0',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const response=await axios(config)
    return response.data
  };
  
  
  module.exports.getOrderbook=async(user)=>{
  const accessToken=user.data.access_token;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.upstox.com/v2/order/retrieve-all',
    headers: { 
      'Accept': 'application/json',
      'Api-Version': '2.0',
      'Authorization': `Bearer ${accessToken}`,
    }
  };
  const response=await axios(config)
  return response.data
}

module.exports.getTradebook=async(user)=>{
  const accessToken=user.data.access_token;
  const url = 'https://api.upstox.com/v2/order/trades/get-trades-for-day';
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  } 
  const response=await axios.get(url, { headers })
  return response.data
}

module.exports.placeOrder = async (user, quantity, instrument_token, transaction_type) => {
  const accessToken = user.data.access_token;
  let config = {
    url: 'https://api.upstox.com/v2/order/place',
    method: 'post',  // Add the 'method' property and set it to 'post'
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    data: {
      quantity,
      product: 'D',
      validity: 'DAY',
      price: 0,
      tag: 'string', // You can include or remove this line based on your requirements
      instrument_token,
      order_type: 'MARKET',
      transaction_type,
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: false,
    }
  };
    const response = await axios(config);
    return response.data;
  };
  
  

  module.exports.stoploss = async (user, instrument_token) => {
    const accessToken = user.data.access_token;
  console.log(accessToken);
  
  let positionConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.upstox.com/v2/portfolio/short-term-positions',
    headers: { 
      'Accept': 'application/json',
      'Api-Version': '2.0',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  const response=await axios(positionConfig)
  const positions=response.data
  const {quantity, transaction_type}=position.map(p=>{
    if(p.instrument_token===instrument_token){
      if(p.transaction_type==="SELL"){
        return {quantity: p.quantity, transaction_type:"BUY"}
      }
      return {quantity: p.quantity, transaction_type:"SELL"}
      
    }
  })
  
  let config = {
    url: 'https://api.upstox.com/v2/order/place',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    data: {
      quantity,
      product: 'D',
      validity: 'DAY',
      price: 0,
      tag: 'string',
      instrument_token,
      order_type: 'MARKET',
      transaction_type,
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: true,
    }
  };

  try {
    const response = await axios(config);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    return { success: false, message: `From stoploss function: ${error.message}` };
  }
};




module.exports.cancelOrder = async (user,order_id) => {
  const accessToken=user.data.access_token;
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: 'https://api.upstox.com/v2/order/cancel',
      headers: { 
        'Accept': 'application/json',
        'Api-Version': '2.0',
        'Authorization': `Bearer ${accessToken}`,
      },
      params:{
        order_id
      }
    };
    console.log(config)
    const response = await axios(config)
    return response.data
  };
  

  module.exports.cancelAll = async (user) => {
    const accessToken=user.data.access_token;
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.upstox.com/v2/order/retrieve-all',
      headers: { 
        'Accept': 'application/json',
        'Api-Version': '2.0',
        'Authorization': `Bearer ${accessToken}`,
      }
    };
    const response = await axios(config)
    let canceledOrders=[]
    for(const order of response.data.data){
      if (order.status==="after market order req received"){
        let config2 = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: 'https://api.upstox.com/v2/order/cancel',
        headers: { 
          'Accept': 'application/json',
          'Api-Version': '2.0',
          'Authorization': `Bearer ${accessToken}`,
        },
        params:{
          "order_id":order.order_id
        }
      };
      const response2 = await axios(config2)
      canceledOrders.push(response2.data.data.order_id)
    }
  }
  return canceledOrders
};


// module.exports.exitPosition = async (req, res, next) => {
//   try {
//     //exit a single given position
//   } catch (error) {
//     console.log("error =>>", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
module.exports.exitPosition = async (user, instrument_token) => {
  try {
    // console.log(user.user)
    const accessToken=user.data.access_token;
    console.log(accessToken)
    //fetch all positions and exit all of them 
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.upstox.com/v2/portfolio/short-term-positions',
      headers: { 
        'Accept': 'application/json',
        'Api-Version': '2.0',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const response=await axios(config)
    const positions=response.data.data
    // console.log(positions)
    positions.map(async p=>{
      if(p.instrument_token===instrument_token){
        console.log(p.quantity>0?"SELL":"BUY")
        let config2 = {
          url: 'https://api.upstox.com/v2/order/place',
          method: 'post',  // Add the 'method' property and set it to 'post'
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          data: {
            quantity:p.quantity,
            product: 'D',
            validity: 'DAY',
            price: 0,
            tag: 'string', // You can include or remove this line based on your requirements
            instrument_token: p.instrument_token,
            order_type: 'MARKET',
            transaction_type: p.quantity>0?"SELL":"BUY",
            disclosed_quantity: 0,
            trigger_price: 0,
            is_amo: false,
          }
        };
          const response2 = await axios(config2);
          console.log(response2)
          return response2

      }
    })
    

  } catch (error) {
    console.log("error =>>", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};





module.exports.exitAll = async (user) => {
  try {
    // console.log(user.user)
    const accessToken=user.data.access_token;
    console.log(accessToken)
    const exitedPositions=[]
    //fetch all positions and exit all of them 
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.upstox.com/v2/portfolio/short-term-positions',
      headers: { 
        'Accept': 'application/json',
        'Api-Version': '2.0',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const response=await axios(config)
    const positions=response.data.data
    // console.log(positions)
    positions.map(async p=>{
      if(p.instrument_token.includes("NSE_FO")){
        console.log(p.quantity>0?"SELL":"BUY")
        let config2 = {
          url: 'https://api.upstox.com/v2/order/place',
          method: 'post',  // Add the 'method' property and set it to 'post'
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          data: {
            quantity:p.quantity,
            product: 'D',
            validity: 'DAY',
            price: 0,
            tag: 'string', // You can include or remove this line based on your requirements
            instrument_token: p.instrument_token,
            order_type: 'MARKET',
            transaction_type: p.quantity>0?"SELL":"BUY",
            disclosed_quantity: 0,
            trigger_price: 0,
            is_amo: false,
          }
        };
          const response2 = await axios(config2);
          console.log(response2)
          exitedPositions.push(response2.data.data.order_id)
        }
      })
      return exitedPositions
    

  } catch (error) {
    console.log("error =>>", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// module.exports.getBrokrage = async (user, instrumentToken, quantity, product, transactionType, price) => {
//     const accessToken=user.data.access_token;
//     console.log("first", accessToken)
//     let config = {
//       method: 'get',
//       maxBodyLength: Infinity,
//       url: 'https://api.upstox.com/v2/charges/brokerage',
//       headers: { 
//         'Accept': 'application/json',
//         'Api-Version': '2.0',
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       params:{
//         "instrument_token":instrumentToken,
//         "price":price,
//         "transaction_type":transactionType,
//         "product":"I",
//         "quantity":quantity
//       }
//     };

//     const response=await axios(config)
//     // const brokerageData=response.data
//     // return brokerageData;
// };






//also add get profile method


