import React from 'react'
import "../search bar/Searchbar.css"
 function SearchBar() {
  return (
    <div className="wrap">
    <div className="search">
       <input type="text" className="searchTerm" placeholder="What foundation are you looking for?"/>
       <button type="submit" className="searchButton" >
         <i className="fa fa-search"></i>
      </button>
    </div>
 </div>
  )
}
export default SearchBar
