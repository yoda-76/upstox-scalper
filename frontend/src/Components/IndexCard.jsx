import React from 'react'

export default function IndexCard(props) {
  const clickHandler=()=>{
    props.onClick(props.index)
  }
  // console.log(props)
  return (
    <div  onClick={clickHandler} value={props.index} className='bg-gray-900  my-2 rounded-2xl w-60 '>
        <div className='text-white'>{props.index}</div>

        <div className='text-white'>{props.ltp}</div>        
    </div>
  )
}
