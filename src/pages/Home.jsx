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

    const totalRaised = dataF.reduce((sum, f) => sum + Number(f.funds || 0), 0)

    return (
        <>
            <section className="hero">
                <h1>Support causes that matter</h1>
                <p>
                    Ghribi Foundation connects you with vetted foundations across Tunisia.
                    Pick a cause below and see your donation reflected instantly.
                </p>
                <div className="impact-stats">
                    <div className="impact-stat">
                        <strong>{dataF.length}</strong>
                        <span>Foundations</span>
                    </div>
                    <div className="impact-stat">
                        <strong>{totalRaised.toLocaleString()} TND</strong>
                        <span>Raised so far</span>
                    </div>
                </div>
            </section>
            <div className="page-container">
                <SearchBar setDataF={setDataF} fetchF={fetchF} />
                <Foundations dataF={dataF} fetchF={fetchF} />
            </div>
        </>
    )
}

export default Home
