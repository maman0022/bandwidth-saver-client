import React, { useEffect, useState } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
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
    (async () => {
      setLoading(true)
      setError(null)
      if (!user.identifier) {
        const fp = await FingerprintJS.load()
        user.identifier = (await fp.get()).visitorId
      }
      ApiService.getFingerprint(user.identifier)
        .then(async response => {
          if (!response.ok) {
            throw new Error((await response.json()).message)
          }
          setFingerprint(await response.json())
        })
        .catch(error => setError(error.message))
        .finally(() => setLoading(false))
    })()
  }, [])

  return (
    <section className='flex-column full-height justify-evenly align-center'>
      {!!error && <h5 className='error-message'>{error}</h5>}
      {loading && !error && <h3 className='loading-message'>Loading</h3>}
      {!uploading && <Upload setUploading={setUploading} fingerprint={fingerprint} setFingerprint={setFingerprint} setStatus={setStatus} identifier={user.identifier} setError={setError} setComplete={setComplete} loading={loading} />}
      {uploading && <Progress setUploading={setUploading} status={status} complete={complete} setComplete={setComplete} setError={setError} />}
    </section>
  )
}

export default Dashboard