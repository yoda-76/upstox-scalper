import React from 'react'

export default function IndexCard(props) {
  const clickHandler=()=>{
    props.onClick(props.index)
  }
  return (
    <div onClick={clickHandler} value={props.index} className='bg-gray-900  my-2 rounded-2xl w-60'>
        <span className='text-white'>{props.index}</span>
    </div>
  )
}
