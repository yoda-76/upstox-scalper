import React, { useEffect, useState } from 'react'
import ColumnHeading from './ColumnHeading'

export default function Info() {
    const [info,setInfo]=useState("positions")
    const [positions, setPositions]=useState()
    const [orderbook, setOrderbook]= useState()
    const [tradebook, setTradebook]= useState()
    const [funds, setFundes]=useState()

    useEffect(()=>{
        try {
            ["get-positions","get-tradebook","get-orderbook","get-funds"].map(async i=>{
                try {
                    const response = await fetch(`http://localhost:4000/console/${i}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "Accept":"/",
                            "token":window.sessionStorage.getItem("token")
                        }
                    });
                    
                    const data = await response.json();
                    if(i==="get-positions"){
                        setPositions(data.data)
                    }else if(i==="get-tradebook"){
                        setTradebook(data.data)
                    }else if(i==="get-orderbook"){
                        setOrderbook(data.data)
                    }else if(i==="get-funds"){
                        setFundes(data.data)
                    }
        
                } catch (error) {
                    console.error('Error:', error.message);
                }
            })


        } catch (error) {
            console.error('Error:', error.message);
        }
    },[])
    


    async function changeHandler(e){
        const i =e.target.id.split("-")
        setInfo(i[1])
    }
  return (
    <div>
        <div className=' flex justify-around'>
            <ColumnHeading id="get-positions" onClick={changeHandler} text="Positions"/>
            <ColumnHeading id="get-orderbook" onClick={changeHandler} text="Order Book"/>
            <ColumnHeading id="get-tradebook" onClick={changeHandler} text="Trade Book"/>
            <ColumnHeading id="get-funds" onClick={changeHandler} text="Funds"/>

        </div>
        <div>
            {info==="positions"&&JSON.stringify(positions)}
            {info==="tradebook"&&JSON.stringify(tradebook)}
            {info==="orderbook"&&JSON.stringify(orderbook)}
            {info==="funds"&&JSON.stringify(funds)}
        </div>
    </div>
  )
}
