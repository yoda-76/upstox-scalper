
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const csvtojson = require('csvtojson');

const url = 'https://assets.upstox.com/market-quote/instruments/exchange/complete.csv.gz';

// Create the 'token_data' folder if it doesn't exist
const parentDirectory = path.resolve(__dirname, '..');
const folderPath = path.join(parentDirectory, 'token_data');
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

const compressedFilePath = path.join(folderPath, 'instrument_data.csv.gz');
const decompressedFilePath = path.join(folderPath, 'instrument_data.csv');
const jsonFilePath = path.join(folderPath, 'options_data.json');
const jsonFilePath2 = path.join(folderPath, 'instrument_keys_data.json');
const jsonFilePath3 = path.join(folderPath, 'structured_options_data.json');
const jsonFilePath4 = path.join(folderPath, 'all_instrument_data.json');
const jsonFilePath5 = path.join(folderPath, 'indexData.json');






axios({
  method: 'get',
  url: url,
  responseType: 'stream',
})
  .then((response) => {
    const writer = fs.createWriteStream(compressedFilePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  })
  .then(() => {
    // Decompress the gzip file
    const input = fs.createReadStream(compressedFilePath);
    const output = fs.createWriteStream(decompressedFilePath);
    input.pipe(zlib.createGunzip()).pipe(output);

    return new Promise((resolve, reject) => {
      output.on('finish', resolve);
      output.on('error', reject);
    });
  })
  .then(() => {
    // Convert CSV to JSON
    return csvtojson().fromFile(decompressedFilePath);
  })
  .then((jsonArray) => {
    fs.writeFileSync(jsonFilePath4, JSON.stringify(jsonArray, null, 2));

    // const indexData=jsonArray.filter(i=> i.instrument_type=="INDEX" )
    

    const structuredData={
      "INDEX":{
        "NIFTY": {},
        "BANKNIFTY": {},
        "FINNIFTY": {} 
      },
      "BANKNIFTY": {},
      "FINNIFTY": {},
      "NIFTY": {}
    }

    jsonArray=jsonArray.filter(i=>{
      // if(i.name=="Nifty 50"){
      //   structuredData.INDEX.NIFTY=i
      // }
      
      // structuredData.INDEX.NIFTY = i.name === "Nifty 50" ? i : {};


      if(i.name==="Nifty 50"){
        structuredData.INDEX.NIFTY=i
      }else if(i.name==="Nifty Bank"){
        structuredData.INDEX.BANKNIFTY=i
      }else if(i.name==="Nifty Fin Service"){
        structuredData.INDEX.FINNIFTY=i
      }
      if(i.instrument_type=="OPTIDX" && ["NIFTY","BANKNIFTY","FINNIFTY"].some(sub=>i.tradingsymbol.startsWith(sub))) return i
  })
    jsonArray.map(i=>{
      // console.log(i)
      if(i.option_type==="CE"){
        const s1=i.tradingsymbol.substring(0,i.tradingsymbol.length-2)
        jsonArray.map(j=>{
          if(j.option_type==="PE"){
            const s2=j.tradingsymbol.substring(0,j.tradingsymbol.length-2)
            if(s1===s2){
              if(i.tradingsymbol.includes("BANKNIFTY")){
                structuredData.BANKNIFTY[`${i.expiry} : ${i.strike}`]={
                  CE:i,
                  PE:j
                }
              }else if(i.tradingsymbol.includes("FINNIFTY")){
                structuredData.FINNIFTY[`${i.expiry} : ${i.strike}`]={
                  CE:i,
                  PE:j
                }
            }else{
              structuredData.NIFTY[`${i.expiry} : ${i.strike}`]={
                CE:i,
                PE:j
              }
          }
          }
        }
      })
      }
    })
    // console.log(structuredData)
    fs.writeFileSync(jsonFilePath3, JSON.stringify(structuredData, null, 2));


    
    const jsonArray2=jsonArray.map(i=>{
        return i.instrument_key
    })
    for(const key in structuredData.INDEX){
      jsonArray2.unshift(structuredData.INDEX[key].instrument_key);
    }
    fs.writeFileSync(jsonFilePath2, JSON.stringify(jsonArray2, null, 2));


    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
    console.log('File downloaded, decompressed, CSV converted to JSON, and saved successfully.');
  })
  .catch((error) => {
    console.error('Error:', error.message || error);
  });


