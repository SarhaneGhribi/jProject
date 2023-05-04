import React, { useState } from 'react'
import "../user authentification/User.css"
import axios from 'axios';
 function User() {
    const [donername,setdonername]=useState("")
    const [submitted, setSubmitted] = useState(false);
    //this function handels the submit and sets the state of submitted to make true to show donation sum 
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true); 
      };
     //this function handels the change in the input and sets the doner's name 
      const handleChange = (event) => {
        setdonername(event.target.value); 
      };
      //this function posts the user name in the doners table in the database using the donername state value when the submit button is clicked
      const postUser=(donername)=>{
        axios.post("http://localhost:5000/doners/",{"name":donername})
        .then(suc=>console.log(suc))
        .catch(err=>console.log(err))
      }
  return (
    <div className='user-info'>
      {submitted ? <h3>Welcome {donername}</h3> : null}
          <form onSubmit={(e)=>{postUser(donername);handleSubmit(e)}}>
      <label>
        Input:
        <input type="text" donername={donername} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
    </div>
  )
}
export default User