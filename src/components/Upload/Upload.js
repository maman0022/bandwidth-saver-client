import React, { useState } from 'react'
import './Upload.css'
import onedrive from '../LandingPage/images/onedrive.png'
import dropbox from '../LandingPage/images/dropbox.jpg'
import ApiService from '../../services/ApiService'
import PropTypes from 'prop-types'

function Upload(props) {
  const [nameError, setNameError] = useState(null)
  const [urlError, setUrlError] = useState(null)

  //create a local copy of fingerprint to limit re-renders
  let fingerprintCopy = { ...props.fingerprint }

  //determine if it is past the quota reset time, if so tell server to reset quota, runs everytime user uploads
  function checkIfResetNeeded() {
    if (Date.now() > Number(fingerprintCopy.next_reset)) {
      return new Promise((resolve, reject) => {
        ApiService.resetFingerprint(fingerprintCopy.identifier)
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

  async function handleUpload(e, service) {
    e.preventDefault()
    if (!service || (service !== 'Dropbox' && service !== 'OneDrive')) {
      props.setError('Invalid service parameter')
      return window.scrollTo(0, 0)
    }
    setNameError(null)
    setUrlError(null)
    props.setError(null)
    try {
      await checkIfResetNeeded()
    } catch (error) {
      props.setError(error)
      return window.scrollTo(0, 0)
    }
    if (fingerprintCopy.current_usage >= fingerprintCopy.max_per_hour) {
      props.setError('You have exhausted your quota for the hour. Please wait until the time listed below.')
      return window.scrollTo(0, 0)
    }
    const form = e.target.parentNode.parentNode
    const filename = form['file-name'].value
    const url = form['file-url'].value
    if (!filename) {
      return setNameError(`File name cannot be blank`)
    }
    if (!url) {
      return setUrlError(`File URL must be a valid URL that starts with http(s)://`)
    }
    props.setUploading(true)
    props.setStatus(`A pop-up should have opened. Please sign-in to your ${service} account, select the folder you want to save the file into and click the ${service === 'Dropbox' ? 'save' : 'open'} button at the bottom right corner.`)
    if (service === 'Dropbox') {
      const options = {
        success: function () {
          ApiService.incrementUsage(fingerprintCopy.identifier)
            .then(async response => {
              if (!response.ok) {
                throw new Error((await response.json()).message)
              }
              ++fingerprintCopy.current_usage
              props.setFingerprint(fingerprintCopy)
              props.setStatus('Success! File saved to your Dropbox.')
              props.setComplete(true)
            })
            .catch(error => {
              props.setError(error.message)
              window.scrollTo(0, 0)
            })
        },
        progress: function (progress) {
          //Just going to show UPLOADING because of dropbox bug in which progress is always returning zero
          props.setStatus('Uploading')
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
    else {
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
            return props.setStatus(`${result.percentageComplete}% Uploaded`)
          }
          if (result.status === 'completed') {
            clearInterval(interval)
            ApiService.incrementUsage(fingerprintCopy.identifier)
              .then(async response => {
                if (!response.ok) {
                  throw new Error((await response.json()).message)
                }
                ++fingerprintCopy.current_usage
                props.setFingerprint(fingerprintCopy)
                props.setStatus('Success! File saved to your OneDrive.')
                props.setComplete(true)
              })
              .catch(error => {
                props.setError(error.message)
                window.scrollTo(0, 0)
              })
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
      {fingerprintCopy.max_per_hour &&
        <>
          <p className='quota'>{`You have used ${fingerprintCopy.current_usage} out of ${fingerprintCopy.max_per_hour} transfers`}</p>
          <p className='quota'>{`Your quota will reset at ${getResetTime()}`}</p>
        </>
      }
      <form id='upload-form'>
        <div>
          <label htmlFor='file-name'>File Name:</label>
          <input className='full-width' type='text' id='file-name' name='file-name' onChange={validateName} required />
        </div>
        {nameError && <h5 className='error-message'>{nameError}</h5>}
        <div>
          <label htmlFor='file-url'>File URL:</label>
          <textarea className='full-width' type='text' id='file-url' name='file-url' onChange={validateUrl} rows='5' required />
        </div>
        {urlError && <h5 className='error-message'>{urlError}</h5>}
        <div className='flex-row align-center justify-evenly flex-wrap'>
          <button className='upload-btn' onClick={e => handleUpload(e, 'Dropbox')} disabled={nameError || urlError || props.loading}>{<img className='logo' alt='dropbox logo' src={dropbox} />}Upload to Dropbox</button>
          <button className='upload-btn' onClick={e => handleUpload(e, 'OneDrive')} disabled={nameError || urlError || props.loading}>{<img className='logo' alt='onedrive logo' src={onedrive} />}Upload to OneDrive</button>
        </div>
      </form>
    </>
  )
}

Upload.defaultProps = {
  setError() { },
  setUploading() { },
  setStatus() { },
  setComplete() { },
  setFingerprint() { },
  loading: true,
  fingerprint: {
    identifier: '',
    max_per_hour: 2,
    current_usage: 0,
    next_reset: Date.now() + 3600000
  }
}

Upload.propTypes = {
  setError: PropTypes.func.isRequired,
  setUploading: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  setComplete: PropTypes.func.isRequired,
  setFingerprint: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  fingerprint: PropTypes.shape({
    identifier: PropTypes.string,
    max_per_hour: PropTypes.number,
    current_usage: PropTypes.number,
    next_reset: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
}

export default Upload