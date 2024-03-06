import React, { useState , useEffect} from 'react'
import io from 'socket.io-client';

import IndexCard from '../Components/IndexCard'
import StrikeInput from '../Components/StrikeInput'
import ExpiryInput from '../Components/ExpiryInput'

import structuredData from "../../../token_data/structured_options_data.json"
import Button from '../Components/Button';
import Info from '../Components/Info';
import Watchlist from '../Components/Watchlist';

export default function TradingConsole() {
    const [error, setError]= useState()
    const email= window.sessionStorage.getItem("email")
    const [index, setIndex]=useState("NIFTY")
    const [niftyLTP, setNiftyLTP]=useState("")
    const [bankNiftyLTP, setBankNiftyLTP]=useState("")
    const [finNiftyLTP, setFinNiftyLTP]=useState("")
    const [feed,setFeed]=useState({})
    const [callStrike, setCallStrike]=useState("select-call-strike")
    const [putStrike, setPutStrike]=useState("select-put-strike")
    const [expiry, setExpiry]=useState("")
    const [expiryList, setExpiryList]=useState([])
    const [callKey, setCallKey]=useState({symbol:"", key:""})
    const [putKey,setPutKey]=useState({symbol:"", key:""})
    const [callLTP,setCallLTP]=useState("")
    const [putLTP,setPutLTP]=useState("")
    const [quantity,setQuantity]=useState(0)
    const [watchlist, setWatchlist]=useState([])

    // const [callStrikeList, setCallStrikeList]=useState("0")
    // const [putStrikeList, setPutStrikeList]=useState("0")
    const [strikeList, setStrikeList]=useState(getStrikeList("NIFTY"))

    function getStrikeList(index){
        if(expiry!=""){
            let list =[] 
            for (const key in structuredData[index]){
                const splits=key.split(":")
                if(expiry== splits[0].trim()){
                    list.push(splits[1].trim())
                }
            }
            // console.log(list)
            return list
        }
        // else{
        //     console.log("first")
        //     setError("plese select the expiry first")
        //     // return
        // }
    }

    function getExpiryList(){
        let list =[] 
        for (const key in structuredData[index]){
            const splits=key.split(":")
            list.push(splits[0].trim())
        }
        // console.log(list)
        return list
    }

    // console.log(getStrikeList("NIFTY"))


    useEffect(()=>{
        console.log("call key: ",callKey, callLTP)
        console.log("put key :", putKey, putLTP)
    })
    

    
    useEffect(()=>{
        if(expiry && callStrike && putStrike){
            for (const key in structuredData[index]){
                const splits=key.split(":")
                if(splits[0].trim()==expiry){
                    if(splits[1].trim()==callStrike){
                        setCallKey({symbol:structuredData[index][key].CE.tradingsymbol, key:structuredData[index][key].CE.instrument_key})
                        setLTP()
                    }
                    if(splits[1].trim()==putStrike){
                        setPutKey({symbol:structuredData[index][key].PE.tradingsymbol, key:structuredData[index][key].PE.instrument_key})
                        setLTP()

                    }
                }
            }
        }
    },[expiry,putStrike, callStrike])

    useEffect(()=>{
        setStrikeList(getStrikeList(index))
    },[expiry,index])
    
    function setLTP(){
        // console.log("ltpset",callLTP, putLTP)
        for(const key in feed){
            console.log(callKey.key,feed[callKey.key])
            if(key==callKey.key && feed[key].cp){
                console.log(callKey.symbol, feed[key].cp)
                setCallLTP(feed[key].cp)
            }
            if(key==putKey.key){ 
                console.log(putKey.symbol, feed[key].cp)
                setPutLTP(feed[key].cp)}
                if(feed["NSE_INDEX|Nifty 50"]&&feed["NSE_INDEX|Nifty 50"].ltp)setNiftyLTP(feed["NSE_INDEX|Nifty 50"].ltp)
                if(feed["NSE_INDEX|Nifty Bank"]&&feed["NSE_INDEX|Nifty Bank"].ltp)setBankNiftyLTP(feed["NSE_INDEX|Nifty Bank"].ltp)
                if(feed["NSE_INDEX|Nifty Fin Service"]&&feed["NSE_INDEX|Nifty Fin Service"].ltp)setFinNiftyLTP(feed["NSE_INDEX|Nifty Fin Service"].ltp)
            // const watchlistItem=watchlist.filter(i=>{
            //     if(i.key===key){

            //     }
            // })
            setWatchlist(prev=>{
                const newWatchlist=prev.map(i=>{
                    if(i.key===key){
                        return {...i, ltp:feed[key].cp}
                    }else{ return i}
                })
                return newWatchlist
            })
        }
    }
    // useEffect(()=>{
    //     console.log(indexLTP)
    // },[indexLTP])

    useEffect(()=>{
        setLTP()

    },[feed])

    useEffect(() => {
      const serverUrl =`http://localhost:4000?email=${email}`; 
      const socket = io(serverUrl);
      socket.on('connect',() => {
        console.log("WebSocket connected test");
        // socket.send(JSON.stringify(initialData));
      });
      socket.on('message',(message) => {
        // console.log(message)
        setFeed(JSON.parse(message))
      });
  
      socket.on('disconnect',() => {
        console.log("WebSocket disconnected");
      });
  
      return () => {
        console.log("useEffect has been deprecated");
        socket.close();
      };
    }, []);

    useEffect(()=>{
        setExpiryList(getExpiryList)
    },[index])
    

    function indexCardClickHandler(name){
        setIndex(name)
        console.log(index)
    }

    function expiryChangeHandler(e){
        console.log(e.target.value)
        setExpiry(e.target.value)
    }
    function callStrikeChangeHandler(e){
        setCallStrike(e.target.value)
    }
    function putStrikeChangeHandler(e){
        setPutStrike(e.target.value)
    }

    function quantityChangeHandler(e){
        setQuantity(e.target.value)
    }

    async function placeOrder(e){
        const id=e.target.id
        const transaction_type = id.split("-")[0].toUpperCase();
        let instrument_token
        if(id.split("-")[1]==="call"){
            instrument_token=callKey.key
        }else if(id.split("-")[1]==="put"){
            instrument_token=putKey.key
        }
        console.log({instrument_token, quantity, transaction_type})
        try {
            const response = await fetch(`http://localhost:4000/console/place-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept":"/",
                    "token": window.sessionStorage.getItem("token")
                },
                body:JSON.stringify({
                    instrument_token, quantity, transaction_type
                })
            });
            
            const data = await response.json();
            console.log("data: ",data)


        } catch (error) {
            console.error('Error:', error.message);
        }


    }

    function addToWatchlist(item){
        setWatchlist(prev=>{
            const exist=prev.filter(i=>{
                return i.key==item.key
            })
            console.log()
            if(!exist.length){
                
                return [...prev,{...item, ltp:feed[item.key]&&feed[item.key].cp}]
            }else return prev

        })
    }

  return (
    <div className='bg-purple-900 h-screen  '>
        <div  className=' h-[13%]  flex justify-around'>
            <IndexCard ltp={niftyLTP} onClick={indexCardClickHandler} index="NIFTY"/>
            <IndexCard ltp={finNiftyLTP} onClick={indexCardClickHandler} index="FINNIFTY"/>
            <IndexCard ltp={bankNiftyLTP} onClick={indexCardClickHandler} index="BANKNIFTY"/>
            {/* <IndexCard onClick={indexCardClickHandler} index="SENSEX"/> */}
        </div>
        <div className=' flex  h-[86%]  '>
            <div className='bg-black opacity-60 w-[20%] h-full m-1'>
                <Watchlist watchlist={watchlist}/>
            </div>
            <div className=' w-[79%]  h-full' >
                <div className=' flex h-[44%] m-1'>
                    <div className='bg-black opacity-60 h-full w-[89%] mr-1 flex-row justify-around text-white '>
                        <div className='flex justify-around'>
                        {expiryList!=[]&&<StrikeInput strikeList={strikeList} onChange={callStrikeChangeHandler}/>}
                        <ExpiryInput expiryList={expiryList} onChange={expiryChangeHandler}/>
                        {expiryList!=[]&&<StrikeInput strikeList={strikeList} onChange={putStrikeChangeHandler}/>}
                        </div>
                    {/* <div className='text-white h-3'>error</div> */}
                    <div className='flex justify-around'>
                        <div>
                            <div className='flex'>
                                <div>Symbol: </div>
                                <div>{callKey.symbol}</div>
                                <button onClick={()=>{
                                    addToWatchlist(callKey)
                                }} className='mx-1'>+</button>
                            </div>
                            <div className='flex'>
                                <div>LTP: </div>
                                <div>{callLTP}</div>
                            </div>
                        </div>
                        <div>
                            <div className='flex'>
                                <div>Symbol: </div>
                                <div>{putKey.symbol}</div>
                                <button onClick={()=>{
                                    addToWatchlist(putKey)
                                }} className='mx-1'>+</button>
                            </div>
                            <div className='flex'>
                                <div>LTP: </div>
                                <div>{putLTP}</div>
                            </div>
                        </div>

                    </div>


                    <div className='flex justify-around'>
                        <div className='flex'>
                            <Button onClick={placeOrder} id="buy-call" text= "Buy Call"/>
                            <Button onClick={placeOrder} id="sell-call" text= "Sell Call"/>
                        </div>
                        <input onChange={quantityChangeHandler} value={quantity} className='text-black' type="number"/>
                        <div className='flex'>
                            <Button onClick={placeOrder} id="buy-put" text= "Buy Put"/>
                            <Button onClick={placeOrder} id="sell-put" text= "Sell Put"/>
                        </div>
                    </div>

                    </div>
                    <div className='bg-black opacity-60 h-full w-[10%] ml-2 text-white'>side bar</div>
                </div>
                <div className='bg-black opacity-60 h-[10%] m-1'></div>
                <div className=' h-[44%] m-1'>
                    <Info/>
                </div>
            </div>
        </div>
    </div>
  )
}
