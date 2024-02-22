import requests
import json
const access_token=
url = 'https://api.upstox.com/v2/order/place'

headers = {
    'Accept': 'application/json',
    'Api-Version': '2.0',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {{your_access_token}}'
}

data = {
"quantity": 15,
"product": "I",
"validity": "DAY",
"price": 0,
"instrument_token": "NSE_FO|40807",
"order_type": "MARKET",
"transaction_type": "BUY",
"disclosed_quantity": 0,
"trigger_price": 0,
"is_amo": False
}
