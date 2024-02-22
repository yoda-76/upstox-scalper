import React, { useState , useEffect} from 'react'
import io from 'socket.io-client';

import IndexCard from '../Components/IndexCard'
import StrikeInput from '../Components/StrikeInput'
import ExpiryInput from '../Components/ExpiryInput'

export default function TradingConsole() {
    const [index, setIndex]=useState({name:"NIFTY", ltp:0})
    const [test,setTest]=useState(0)
    const indexCardClickHandler = (name)=>{
        setIndex({name, ltp:0})
    }




    useEffect(() => {
        const serverUrl =`http://localhost:4000?email=test14@gmail.com`;
        const socket = io(serverUrl);
        socket.on('connect',() => {
          console.log("WebSocket connected test");
          // socket.send(JSON.stringify(initialData));
        });
        socket.on('message',(message) => {
          console.log(message)
        });
    
        socket.on('disconnect',() => {
          console.log("WebSocket disconnected");
        });
    
        return () => {
          console.log("useEffect has been deprecated");
          socket.close();
        };
      }, []);
    







  return (
    <div className='bg-purple-900 h-screen  '>
        <div  className=' h-[13%]  flex justify-around'>
            <IndexCard onClick={indexCardClickHandler} index="NIFTY"/>
            <IndexCard onClick={indexCardClickHandler} index="FINNIFTY"/>
            <IndexCard onClick={indexCardClickHandler} index="BANKNIFTY"/>
            <IndexCard onClick={indexCardClickHandler} index="SENSEX"/>
        </div>
        <div className=' flex  h-[86%]  '>
            <div className='bg-black opacity-60 w-[20%] h-full m-1'></div>
            <div className=' w-[79%]  h-full' >
                <div className=' flex h-[44%] m-1'>
                    <div className='bg-black opacity-60 h-full w-[89%] mr-1 flex justify-around text-white '>
                        <StrikeInput/>
                        <ExpiryInput/>
                        <StrikeInput/>
                        {test}
                    </div>

                    <div className='bg-black opacity-60 h-full w-[10%] ml-2'></div>
                </div>
                <div className='bg-black opacity-60 h-[10%] m-1'></div>
                <div className='bg-black opacity-60 h-[44%] m-1'></div>
            </div>
        </div>
    </div>
  )
}
