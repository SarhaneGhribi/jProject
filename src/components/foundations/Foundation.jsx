import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "../foundations/Foundations.css"
import { useAuth } from '../../context/AuthContext'
import { createDonation } from '../../api/donations'

function Foundations({dataF,fetchF}) {
const { user } = useAuth()
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState('');
  console.log("foundation",dataF)

  const handleSubmit = (event,foundationId) => {
    event.preventDefault();
    setError('');
    const donationAmount = event.target.elements['donation-amount'].value;
    createDonation(foundationId, donationAmount)
      .then(() => {
        setSubmitted(true);
        event.target.reset();
        fetchF();
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not record your donation'))
  }

  return (
    <div>

      {dataF.map((e,i)=>
      <div className='comp' key={e.idfoundations}>
        <h2 >{e.name}</h2>
        <img className='logo' src={e.logo}alt="" />
        {submitted ? <h2>{e.funds} TND</h2>: null}
    {user ? (
    <form onSubmit={(event) => handleSubmit(event,e.idfoundations)}>
      <label htmlFor='donation-amount'>Enter your donation amount:</label>
      <input
        id='donation-amount'
        type='number'
        min='1'
        placeholder='Enter amount in TND'
        aria-label='Donation amount'
        required
      />
      <button type='submit'>Donate</button>
    </form>
    ) : (
      <p><Link to="/login">Log in</Link> to donate to this foundation.</p>
    )}
    </div>
    )}
    {error && <p className='donation-error'>{error}</p>}
  </div>
  )
}
export default Foundations
