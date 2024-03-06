import React from 'react'


export default function StrikeInput(props) {
  // const p=e=>{
    // console.log(props.strikeList)
  // }
  return (
    <div>
      <label htmlFor="strike-dropdown">Call Strike:</label>
      <select className='w-20 text-black'  onChange={props.onChange} name="strike-dropdown" id="strike-dropdown">
      {props.strikeList&&props.strikeList.map(i=>{
          return <option value={i}>{i}</option>
        })}
      </select>
    </div>
  )
}
