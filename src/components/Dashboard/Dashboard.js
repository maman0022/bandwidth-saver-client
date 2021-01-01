import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import UserService from '../../services/UserService'
import ApiService from '../../services/ApiService'
import Upload from '../Upload/Upload'
import Progress from '../Progress/Progress'

function Dashboard() {
  const user = UserService.getUser()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fingerprint, setFingerprint] = useState({})
  const [status, setStatus] = useState('')
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    ApiService.getFingerprint(user.email)
      .then(async response => {
        if (!response.ok) {
          throw new Error((await response.json()).message)
        }
        setFingerprint(await response.json())
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className='flex-column full-height justify-evenly'>
      {!!error && <h5 className='error-message'>{error}</h5>}
      {loading && !error && <h3 className='loading-message'>Loading</h3>}
      {!uploading && <Upload setUploading={setUploading} fingerprint={fingerprint} setFingerprint={setFingerprint} setStatus={setStatus} email={user.email} setError={setError} setComplete={setComplete} />}
      {uploading && <Progress setUploading={setUploading} status={status} complete={complete} setComplete={setComplete} />}
    </section>
  )
}

export default Dashboard