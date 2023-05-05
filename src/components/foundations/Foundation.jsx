import axios from 'axios'
import React, { useState } from 'react'
import "../foundations/Foundations.css"
import SearchBar from '../search bar/SearchBar';
<foundations />
 function Foundations({dataF,fetchF}) {
const [donations,setdonation]=useState(null)
const [submitted, setSubmitted] = useState(false);
  console.log("foundation",dataF)

  const handleSubmit = (event,funds,name) => {
    event.preventDefault();
    setSubmitted(true); 
    const donationAmount = event.target.elements['donation-amount'].value;
    setdonation(donationAmount);
     const updatedFunds = Number(funds) + Number(donations);
     console.log("money",updatedFunds)
 if(updatedFunds<=1000){
  axios.patch(`http://localhost:5000/foundations/${name}`,{funds:updatedFunds})
  .then(suc=>{console.log(suc.data)
    fetchF()})
  .catch(error => console.log(error))
 }  
 else{
  axios.delete(`http://localhost:5000/foundations/${name}`)
  .then(suc=> {console.log(suc.data)
    fetchF()})
  .catch(error => console.log(error))
 }
  }

  return (
    <div>
    
      {dataF.map((e,i)=>
      <div className='comp' key={e.idfoundations}>
        <h2 >{e.name}</h2>
        <img className='logo' src={e.logo}alt="" />
        {submitted ? <h2>{e.funds} TND</h2>: null}
    <form onSubmit={(event) => handleSubmit(event,e.funds,e.name)}>
      <label htmlFor='donation-amount'>Enter your donation amount:</label>
      <input
        id='donation-amount'
        type='text'
        placeholder='Enter amount in TND'
        aria-label='Donation amount'
        required
      />
      <button type='submit'>Donate</button>
    </form>
    </div>
    )}
  </div>
  )
}
export default Foundations