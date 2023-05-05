import React, { useState } from 'react'
import "../search bar/Searchbar.css"
import axios from 'axios'
 function SearchBar({setDataF}) {
const [name,setName]=useState("")
const search=(name)=>{
  axios.get(`http://localhost:5000/foundations/${name}`)
  .then((res)=>{
    setDataF(res.data)
  })
  .catch((err)=>{console.log(err)})
}
const handleSearch=()=>{
  search(name)
 }
  return (
    <div className="wrap">
    <div className="search">
       <input type="text" className="searchTerm" placeholder="What foundation are you looking for?"onChange={(e)=>setName(e.target.value)} />
       <button type="submit" onClick={handleSearch} >Submit</button>
    </div>
 </div>
  )
}
export default SearchBar
