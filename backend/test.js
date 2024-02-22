const at="eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI0SkJIM1AiLCJqdGkiOiI2NThjYjg5ODJlMTJkMDM1NDIyN2QzYmIiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDM3MjExMTIsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwMzgwMDgwMH0.Sg1W_oZ-6UQxm21LUBkjnRYFUlOTZl6LXm6V275XP0g"


const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.upstox.com/v2/charges/brokerage',
  headers: { 
    'Accept': 'application/json',
    'Api-Version': '2.0',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI0SkJIM1AiLCJqdGkiOiI2NThjYjg5ODJlMTJkMDM1NDIyN2QzYmIiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDM3MjExMTIsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwMzgwMDgwMH0.Sg1W_oZ-6UQxm21LUBkjnRYFUlOTZl6LXm6V275XP0g',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  params:{
    "instrument_token":"NSE_FO|35047",
    "price":"3.70",
    "transaction_type":"BUY",
    "product":"I",
    "quantity":"15"
  }
};

axios(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
