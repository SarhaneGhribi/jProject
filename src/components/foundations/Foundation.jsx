import React from 'react'
import "../foundations/Foundations.css"
import FoundationCard from './FoundationCard'

function Foundations({ dataF, fetchF }) {
  if (!dataF.length) {
    return <p className="empty-state">No foundations found.</p>
  }

  return (
    <div className="foundation-grid">
      {dataF.map((foundation) => (
        <FoundationCard key={foundation.idfoundations} foundation={foundation} onDonated={fetchF} />
      ))}
    </div>
  )
}
export default Foundations
