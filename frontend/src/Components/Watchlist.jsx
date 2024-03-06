import React from 'react'

export default function Watchlist(props) {
    console.log(props.watchlist)

    // function findMatches(wordToMatch, cities){
    //     // 
    //     return cities.filter(place => {
    //         let regex= new RegExp(wordToMatch,'gi');
    //         return place.city.match(regex) || place.state.match(regex);
    //     })
    // }

    // function changeHandler(e){
    //     const matcharray=findMatches(e.target.value,cities);
    // const html=matcharray.map((place)=>{
    //     const regex=new RegExp(this.value,'gi');
    //     const cityname=place.city.replace(regex,`<span class='hl'>${this.value}</span>`);
    //     const statename=place.state.replace(regex,`<span class='hl'>${this.value}</span>`);
    //     return `<li>
    //             <span>${cityname}, ${statename}</span><span>${place.population}</span>
    //             </li>`
    // }
  return (
    <div>
        <input  type='text'/>
        <ul>
            {props.watchlist.map(i=>{
                return <li className='text-white flex justify-around' key={i.key}><span>{i.symbol}</span><span>{i.ltp}</span></li>
            })}
        </ul>
    </div>
  )
}
