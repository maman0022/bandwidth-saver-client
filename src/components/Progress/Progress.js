import React from 'react'
import './Progress.css'
import popup from './popup.png'
import PropTypes from 'prop-types'

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

Progress.defaultProps = {
  setError() { },
  setUploading() { },
  setComplete() { },
  complete: '',
  status: ''
}

Progress.propTypes = {
  setError: PropTypes.func.isRequired,
  setUploading: PropTypes.func.isRequired,
  setComplete: PropTypes.func.isRequired,
  complete: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
}

export default Progress