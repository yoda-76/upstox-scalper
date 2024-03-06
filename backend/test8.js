const i = {
    instrument_key: 'NSE_INDEX|Nifty 50',
    exchange_token: '17',
    tradingsymbol: '',
    name: 'Nifty 50',
    last_price: '21951.15',
    expiry: '',
    strike: '',
    tick_size: '',
    lot_size: '',
    instrument_type: 'INDEX',
    option_type: '',
    exchange: 'NSE_INDEX'
  }
  data={}
  if(i.name=="Nifty 50"){
    data=i
  }
  console.log("1",data)
  data = i.name === "Nifty 50" ? i : {};
  console.log("2",data)