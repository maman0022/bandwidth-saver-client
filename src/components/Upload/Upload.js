import React, { useState } from 'react'
import ApiService from '../../services/ApiService'

function Upload(props) {
  const [nameError, setNameError] = useState(null)
  const [urlError, setUrlError] = useState(null)

  //create a local copy of fingerprint to limit re-renders
  let fingerprintCopy = { ...props.fingerprint }

  //determine if it is past the quota reset time, if so tell server to reset quota || run everytime user uploads
  function checkIfResetNeeded() {
    if (Date.now() > Number(fingerprintCopy.next_reset)) {
      return new Promise((resolve, reject) => {
        ApiService.resetFingerprint(props.email)
          .then(async response => {
            if (!response.ok) {
              return reject((await response.json()).message)
            }
            fingerprintCopy = (await response.json())
            resolve()
          })
      })
    }
  }

  async function handleDropbox(e) {
    e.preventDefault()
    setNameError(null)
    setUrlError(null)
    props.setError(null)
    try {
      await checkIfResetNeeded()
    } catch (error) {
      return props.setError(error)
    }
    if (fingerprintCopy.current_usage >= fingerprintCopy.max_per_hour) {
      return props.setError('You have exhausted your quota for the hour. Please wait until the time listed below.')
    }
    const form = e.target.parentNode
    const filename = form['file-name'].value
    const url = form['file-url'].value
    if (!filename) {
      return setNameError(`File name cannot be blank`)
    }
    if (!url) {
      return setUrlError(`File URL must be a valid URL that starts with http(s)://`)
    }
    props.setUploading(true)
    props.setStatus('A pop-up should have opened. Please sign-in to your Dropbox account and afterwards click the save button at the bottom right corner.')
    const options = {
      success: function () {
        ++fingerprintCopy.current_usage
        props.setFingerprint(fingerprintCopy)
        props.setStatus("Success! Files saved to your Dropbox.")
        props.setComplete(true)
      },
      progress: function (progress) {
        props.setStatus(`${progress * 100}% uploaded`)
      },
      cancel: function () {
        props.setFingerprint(fingerprintCopy)
        props.setStatus("The transfer was canceled.")
        props.setComplete(true)
      },

      error: function (errorMessage) {
        props.setFingerprint(fingerprintCopy)
        props.setStatus(`Error occured: ${errorMessage}`)
        props.setComplete(true)
      }
    }
    // eslint-disable-next-line no-undef
    Dropbox.save(url, filename, options)
  }

  //get the quota reset time in the users local time
  function getResetTime() {
    const t = new Date(Number(fingerprintCopy.next_reset))
    return t.toLocaleTimeString()
  }

  function validateName(e) {
    if (e.currentTarget.value.trim() === '') {
      return setNameError(`File name cannot be blank`)
    }
    setNameError(null)
  }

  function validateUrl(e) {
    if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(e.currentTarget.value)) {
      return setUrlError(`File URL must be a valid URL that starts with http(s)://`)
    }
    setUrlError(null)
  }

  return (
    <>
      {fingerprintCopy.max_per_hour && <h3>{`You have used ${fingerprintCopy.current_usage} out of ${fingerprintCopy.max_per_hour} transfers. Your quota will reset at ${getResetTime()}`}</h3>}
      <form>
        <label htmlFor='file-name'>File Name:</label>
        <input className='full-width' type='text' id='file-name' name='file-name' onChange={validateName} required />
        {nameError && <h5 className='error-message'>{nameError}</h5>}
        <label htmlFor='file-url'>File URL:</label>
        <textarea className='full-width' type='text' id='file-url' name='file-url' onChange={validateUrl} required />
        {urlError && <h5 className='error-message'>{urlError}</h5>}
        <button onClick={handleDropbox} disabled={nameError || urlError}>Upload to Dropbox</button>
        <button>Upload to OneDrive</button>
      </form>
    </>
  )
}

export default Upload