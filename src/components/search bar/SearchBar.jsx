import React, { useState } from 'react'
import "../search bar/Searchbar.css"
import axios from 'axios'
function SearchBar({ setDataF, fetchF }) {
  const [name, setName] = useState("")
  const search = (name) => {
    axios.get(`http://localhost:5000/foundations/${name}`)
      .then((res) => {
        setDataF(res.data)
      })
      .catch((err) => { console.log(err) })
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    search(name)
  }
  const handleClear = () => {
    setName("")
    fetchF()
  }
  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        type="text"
        className="searchTerm"
        placeholder="What foundation are you looking for?"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" className="btn btn-primary searchButton">Search</button>
      {name && <button type="button" className="btn btn-ghost" onClick={handleClear}>Clear</button>}
    </form>
  )
}
export default SearchBar
