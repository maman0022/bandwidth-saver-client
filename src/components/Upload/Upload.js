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
        ApiService.resetFingerprint(props.identifier)
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
        props.setStatus('Success! File saved to your Dropbox.')
        props.setComplete(true)
      },
      progress: function (progress) {
        //Just going to show UPLOADING because of dropbox bug in which progress is always returning zero
        props.setStatus('UPLOADING')
      },
      cancel: function () {
        props.setFingerprint(fingerprintCopy)
        props.setStatus('The transfer was canceled.')
        props.setComplete(true)
      },

      error: function (errorMessage) {
        props.setFingerprint(fingerprintCopy)
        props.setStatus(errorMessage.toString())
        props.setComplete(true)
      }
    }
    // eslint-disable-next-line no-undef
    Dropbox.save(url, filename, options)
  }

  async function handleOnedrive(e) {
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
    props.setStatus('A pop-up should have opened. Please sign-in to your OneDrive account and afterwards select the folder you want to save the file into and click the open button at the bottom right corner.')
    const options = {
      clientId: process.env.REACT_APP_OD_CLIENT_ID,
      action: 'query',
      viewType: 'folders',
      success: function (folder) {
        uploadToOnedrive(folder, filename, url)
      },
      cancel: function () {
        props.setFingerprint(fingerprintCopy)
        props.setStatus("The transfer was canceled.")
        props.setComplete(true)
      },
      error: function (errorMessage) {
        props.setFingerprint(fingerprintCopy)
        props.setStatus(errorMessage.toString())
        props.setComplete(true)
      }
    }
    // eslint-disable-next-line no-undef
    OneDrive.open(options)
  }

  function uploadToOnedrive(folder, name, url) {
    if (!folder || !folder.apiEndpoint || !folder.accessToken || !folder.value[0] || !folder.value[0].parentReference || !folder.value[0].parentReference.driveId || !folder.value[0].id || !url || !name) {
      props.setStatus('Error Occurred - A required value is unavailable. Please go back to the dashboard and try again.')
      return props.setComplete(true)
    }
    const headers = {
      'Prefer': 'respond-async',
      'Authorization': `Bearer ${folder.accessToken}`,
      'Content-Type': 'application/json'
    }
    const body = JSON.stringify({
      "@microsoft.graph.sourceUrl": url,
      name,
      "file": {}
    })
    const uploadEndpoint = `${folder.apiEndpoint}/drives/${folder.value[0].parentReference.driveId}/items/${folder.value[0].id}/children`
    fetch(uploadEndpoint, { method: 'POST', headers, body })
      .then(async response => {
        if (!response.ok || !response.headers.get('location')) {
          props.setStatus(`Error Occurred - Unable to upload. Please go back to the dashboard and try again.`)
          return props.setComplete(true)
        }
        monitorOnedriveUpload(response.headers.get('location'))
      })
  }

  function monitorOnedriveUpload(url) {
    let interval
    interval = setInterval(() => {
      fetch(url)
        .then(async response => {
          if (!response.ok) {
            let errorMessage = 'Error Occurred - Unable to monitor progress of upload. Please go back to the dashboard and try again.'
            if (response.headers.get('content-type').includes('application/json')) {
              const result = await response.json()
              if (result.statusDescription) {
                errorMessage = `Error Occurred - ${result.statusDescription}`
              }
            }
            props.setStatus(errorMessage)
            props.setComplete(true)
            return clearInterval(interval)
          }
          const result = await response.json()
          if (!result.status || result.status === 'failed') {
            props.setStatus(`Error Occurred${result.statusDescription ? ` - ${result.statusDescription}` : void 0}`)
            props.setComplete(true)
            return clearInterval(interval)
          }
          if (result.status === 'inProgress' || result.status === 'notStarted') {
            if (result.percentageComplete === undefined) {
              return
            }
            return props.setStatus(`${result.percentageComplete}% UPLOADED`)
          }
          if (result.status === 'completed') {
            ++fingerprintCopy.current_usage
            props.setFingerprint(fingerprintCopy)
            props.setStatus('Success! File saved to your OneDrive.')
            props.setComplete(true)
            return clearInterval(interval)
          }
        })
    }, 1000)
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
        <button onClick={handleOnedrive} disabled={nameError || urlError}>Upload to OneDrive</button>
      </form>
    </>
  )
}

export default Upload