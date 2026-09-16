import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Foundations from '../components/foundations/Foundation.jsx'
import SearchBar from '../components/search bar/SearchBar'

function Home() {
    const [dataF, setDataF] = useState([])

    //this function gets all the data from the foundation table abd sets it in the dataF hook
    const fetchF = () => {
        axios
            .get('http://localhost:5000/foundations')
            .then((suc) => {
                setDataF(suc.data)
            })
            .catch((err) => console.log(err.message))
    }

    useEffect(() => {
        fetchF()
    }, [])

    return (
        <>
            <Foundations dataF={dataF} fetchF={fetchF} />
            <SearchBar setDataF={setDataF} />
        </>
    )
}

export default Home
