import axios from 'axios'
import React, { useState } from 'react'
import "../foundations/Foundations.css"

function Foundations({dataF,fetchF}) {
const [submitted, setSubmitted] = useState(false);
  console.log("foundation",dataF)

  const handleSubmit = (event,funds,name) => {
    event.preventDefault();
    setSubmitted(true);
    const donationAmount = event.target.elements['donation-amount'].value;
     const updatedFunds = Number(funds) + Number(donationAmount);
     console.log("money",updatedFunds)
  axios.patch(`http://localhost:5000/foundations/${name}`,{funds:updatedFunds})
  .then(suc=>{console.log(suc.data)
    fetchF()})
  .catch(error => console.log(error))
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