import React from 'react'

function Progress(props) {
  function handleGoBack() {
    props.setUploading(false)
    props.setComplete(false)
  }

  return (
    <>
      <h2 id='upload-status'>{props.status}</h2>
      {props.complete && <button onClick={handleGoBack}>Go Back</button>}
    </>
  )
}

export default Progress