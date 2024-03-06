import React from 'react'

export default function ColumnHeading(props) {
  return (
    <button id={props.id} onClick={props.onClick} className='w-1/5 bg-black text-white text-center rounded-xl'>{props.text}</button>
  )
}
