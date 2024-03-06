import React from 'react'

export default function ExpiryInput(props) {
  // console.log(props.expiryList)
  return (
    <div>
      <label htmlFor="expiry-dropdown">expiry:</label>
      <select className='text-black'  onChange={props.onChange} name="expiry-dropdown" id="expiry-dropdown">
      {props.expiryList.map(i=>{
          return <option value={i}>{i}</option>
        })}
      </select>
    </div>
  )
}
