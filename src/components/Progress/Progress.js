import React from 'react'
import './Progress.css'
import popup from './popup.png'

function Progress(props) {
  function handleGoBack() {
    props.setError(false)
    props.setUploading(false)
    props.setComplete(false)
  }

  return (
    <>
      <img id='popup' src={popup} alt='computer popup graphic' />
      <p id='upload-status'>{props.status}</p>
      {props.complete && <button id='back-btn' onClick={handleGoBack}>Go Back</button>}
    </>
  )
}

export default Progress