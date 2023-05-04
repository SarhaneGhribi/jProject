import './App.css';
import React, { useEffect, useState } from 'react';
import User from './components/user authentification/User';
import Foundations from './components/foundations/Foundation.jsx';
import axios from 'axios';

function App() {
  const[dataF,setDataF]=useState([])

  //this function gets all the data from the foundation table abd sets it in the dataF hook
  const fetchF=()=>{
  axios.get("http://localhost:5000/foundations")
  .then(suc=>{setDataF(suc.data)})
  .catch(err=>console.log(err.message))
  }
  
  useEffect(() => {
    fetchF();
  }, []);
  
  return (
    <div className="App">
    <h1>Ghribi Foundation</h1>
           <User/>
      <Foundations dataF={dataF}/>
    </div>
  );
}

export default App;

