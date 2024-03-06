import React from 'react'

export default function Button(props) {
  return (
    <button id={props.id} className='bg-black border-black font-extrabold m-2' onClick={props.onClick}>{props.text}</button>
  )
}
